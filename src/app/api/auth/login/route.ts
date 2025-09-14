import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyPassword, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // First check super_admin collection
    let user = await db.collection("super_admin").findOne({ email });
    let isSuperAdmin = true;

    if (!user) {
      // If not super admin, check regular admins
      user = await db.collection("admins").findOne({ email });
      isSuperAdmin = false;

      if (!user) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      // Check if admin is approved
      if (user.status !== "approved") {
        return NextResponse.json(
          { error: "Account is pending approval" },
          { status: 403 }
        );
      }
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: isSuperAdmin ? "super_admin" : "admin",
      name: user.name,
    });

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      id: user._id.toString(),
      role: isSuperAdmin ? "super_admin" : "admin",
      name: user.name,
      token: token,
      email: user.email,
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
