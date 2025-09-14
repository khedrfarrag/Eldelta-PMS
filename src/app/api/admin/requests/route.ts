import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyAdmin, verifySuperAdmin } from "@/lib/auth";
import { ObjectId } from "mongodb";

// GET - Get all requests with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const serviceType = searchParams.get("serviceType");
    const serviceId = searchParams.get("serviceId");
    const productType = searchParams.get("productType");
    const destinationCountry = searchParams.get("destinationCountry");
    const exportCountry = searchParams.get("exportCountry");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Build filter
    const filter: any = {};
    if (status && status !== "all") {
      filter.status = status;
    }
    if (serviceType && serviceType !== "all") {
      filter.serviceType = serviceType;
    }
    if (serviceId && serviceId !== "all") {
      filter.serviceId = serviceId;
    }
    if (productType && productType.trim() !== "") {
      filter.productType = { $regex: `^${escapeRegex(productType.trim())}`, $options: "i" };
    }
    if (destinationCountry && destinationCountry.trim() !== "") {
      filter.destinationCountry = { $regex: `^${escapeRegex(destinationCountry.trim())}`, $options: "i" };
    }
    if (exportCountry && exportCountry.trim() !== "") {
      filter.exportCountry = { $regex: `^${escapeRegex(exportCountry.trim())}`, $options: "i" };
    }

    // Global search across multiple fields (contains)
    if (search && search.trim() !== "") {
      const term = escapeRegex(search.trim());
      const regex = { $regex: term, $options: "i" };
      filter.$or = [
        { productType: regex },
        { destinationCountry: regex },
        { exportCountry: regex },
        { customerName: regex },
        { email: regex },
        { phone: regex },
        { serviceName: regex },
      ];
    }

    // Get requests with pagination
    const raw = await db
      .collection("requests")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Normalize ids and dates for client consumption
    const requests = raw.map((doc: any) => ({
      ...doc,
      _id: doc?._id?.toString?.() ?? doc?._id,
      createdAt: doc?.createdAt instanceof Date ? doc.createdAt.toISOString() : doc?.createdAt,
      updatedAt: doc?.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc?.updatedAt,
      readyDate: doc?.readyDate instanceof Date ? doc.readyDate.toISOString() : doc?.readyDate,
      desiredArrivalDate: doc?.desiredArrivalDate instanceof Date ? doc.desiredArrivalDate.toISOString() : doc?.desiredArrivalDate,
    }));

    // Get total count
    const total = await db.collection("requests").countDocuments(filter);

    return NextResponse.json({
      success: true,
      requests,
      pagination: {
        CurrentPage: page,
        PageSize: limit,
        TotalCount: total,
        TotalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get requests error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update request status
export async function PATCH(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId, status, adminNotes } = await request.json();

    if (!requestId || !status) {
      return NextResponse.json(
        { error: "Request ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "in_progress", "completed", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Validate ObjectId
    if (typeof requestId !== 'string' || !/^[a-fA-F0-9]{24}$/.test(requestId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Update request
    const result = await db.collection("requests").updateOne(
      { _id: new ObjectId(requestId) },
      {
        $set: {
          status,
          adminNotes: adminNotes || "",
          updatedAt: new Date(),
          updatedBy: authResult.user?.id,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Request status updated successfully",
    });
  } catch (error) {
    console.error("Update request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete request (super admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Verify super admin authentication
    const authResult = await verifySuperAdmin(request);
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: "Unauthorized - Super Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("id");

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (typeof requestId !== 'string' || !/^[a-fA-F0-9]{24}$/.test(requestId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Delete request
    const result = await db
      .collection("requests")
      .deleteOne({ _id: new ObjectId(requestId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (error) {
    console.error("Delete request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
