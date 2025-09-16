import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

interface Service {
  id: string;
  name: string | { ar: string; en: string };
  description: string | { ar: string; en: string };
  features?: (string | { ar: string; en: string })[];
  status?: "active" | "inactive";
  Image: string;
  isHighlighted: boolean;
}

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  // Function to determine the correct form route based on service name
  const getFormRoute = (serviceName: string | { ar: string; en: string } | any) => {
    // Handle different formats: string, translation object, or any other format
    let name = '';
    
    if (typeof serviceName === 'string') {
      name = serviceName.toLowerCase();
    } else if (serviceName && typeof serviceName === 'object') {
      // Handle translation object format
      if (serviceName[language]) {
        name = (serviceName[language] || '').toString().toLowerCase();
      } else if (serviceName.ar) {
        name = (serviceName.ar || '').toString().toLowerCase();
      } else if (serviceName.en) {
        name = (serviceName.en || '').toString().toLowerCase();
      } else {
        // Fallback: try to get any string value from the object
        const values = Object.values(serviceName).filter(v => typeof v === 'string');
        name = (values[0] || '').toString().toLowerCase();
      }
    } else {
      // Fallback for any other type
      name = String(serviceName || '').toLowerCase();
    }
    
    const serviceId = (service as any)._id || (service as any).id;
    if (name.includes("استيراد") || name.includes("import")) {
      return `/services/${serviceId}/import-form`;
    } else if (name.includes("تصدير") || name.includes("export")) {
      return `/services/${serviceId}/export-form`;
    } else if (
      name.includes("شحن") ||
      name.includes("نقل") ||
      name.includes("logistics") ||
      name.includes("لوجستي")
    ) {
      return `/services/${serviceId}/logistics-form`;
    } else if (
      name.includes("تخليص") ||
      name.includes("جمرك") ||
      name.includes("customs") ||
      name.includes("مورد") ||
      name.includes("مستورد")
    ) {
      return `/services/${serviceId}/suppliers-form`;
    }
    // Default to suppliers form for other services
    return `/services/${serviceId}/suppliers-form`;
  };

  return (
    <Link href={getFormRoute(service.name)} className="group block">
      <div
        className={`
          relative w-[298px] h-[385px] p-8 rounded-2xl transition-all duration-500 cursor-pointer
          flex flex-col items-center justify-center text-center drop-shadow-xl shadow-2xl 
          ${service.isHighlighted ? "bg-[var(--color-secondary)] dark:bg-[var(--color-secondary)] " : ""}
          group-hover:bg-[var(--color-secondary)]  hover:drop-shadow-teal-600 
          group-hover:scale-105 group-hover:-translate-y-1  
        `}
      >
        {/* Icon */}
        <div className="mb-6">
          <div
            className={`
              w-16 h-16 rounded-full flex items-center justify-center
              ${
                service.isHighlighted
                  ? "bg-[var(--color-secondary)] bg-opacity-10 border border-gray-300 "
                  : "dark:bg-[var(--color-secondary)] bg-opacity-10 border border-gray-500 dark:border-gray-300"
              }
            `}
          >
            <Image
              src={service.Image}
              alt={(() => {
                if (typeof service.name === 'string') {
                  return service.name;
                } else if (service.name && typeof service.name === 'object') {
                  return service.name[language] || service.name.ar || service.name.en || 'Service';
                }
                return 'Service';
              })()}
              width={32}
              height={32}
              loading="lazy"
              sizes="32px"
              className="w-8 h-8"
            />
          </div>
        </div>

        {/* Title */}
        <h3
          className={`
            text-xl font-bold mb-4
            ${
              service.isHighlighted
                ? "text-white"
                : "text-gray-300 dark:text-gray-900 group-hover:text-white"
            }
          `}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {(() => {
            if (typeof service.name === 'string') {
              return service.name;
            } else if (service.name && typeof service.name === 'object') {
              return service.name[language] || service.name.ar || service.name.en || 'Service';
            }
            return 'Service';
          })()}
        </h3>

        {/* Description */}
        <p
          className={`
            text-sm leading-relaxed mb-4
            ${
              service.isHighlighted
                ? "text-white/90"
                : "text-gray-300 dark:text-gray-500 group-hover:text-white"
            }
          `}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {(() => {
            if (typeof service.description === 'string') {
              return service.description;
            } else if (service.description && typeof service.description === 'object') {
              return service.description[language] || service.description.ar || service.description.en || '';
            }
            return '';
          })()}
        </p>

        {/* Features */}
        {service.features && service.features.length > 0 && (
          <div className="mb-4 w-full">
            <h4
              className={`
              text-xs font-semibold mb-2 text-left
              ${
                service.isHighlighted
                  ? "text-white/80"
                  : "text-gray-300 dark:text-gray-500 group-hover:text-white"
              }
            `}
            >
              {isRTL ? "المميزات:" : "Features:"}
            </h4>
            <ul className="space-y-1 text-left">
              {service.features.slice(0, 3).map((feature: any, index: number) => {
                let featureText = '';
                if (typeof feature === 'string') {
                  featureText = feature;
                } else if (feature && typeof feature === 'object') {
                  featureText = feature[language] || feature.ar || feature.en || '';
                } else {
                  featureText = String(feature || '');
                }
                
                return (
                  <li
                    key={index}
                    className={`
                    text-xs flex items-start
                    ${
                      service.isHighlighted
                        ? "text-white/70"
                        : "text-gray-300 dark:text-gray-500 group-hover:text-white"
                    }
                  `}
                  >
                    <span className="ml-1 mt-0.5">•</span>
                    <span className="text-xs">
                      {featureText}
                    </span>
                  </li>
                );
              })}
              {service.features.length > 3 && (
                <li
                  className={`
                  text-xs
                  ${
                    service.isHighlighted
                      ? "text-white/60"
                      : "text-gray-300 dark:text-gray-500 group-hover:text-white"
                  }
                `}
                >
                  +{service.features.length - 3} {isRTL ? "أخرى" : "more"}
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Status */}
        {service.status && (
          <div className="absolute top-4 right-4">
            <span
              className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${
                service.status === "active"
                  ? service.isHighlighted
                    ? "bg-green-400 text-green-900"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : service.isHighlighted
                    ? "bg-gray-400 text-gray-900"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              }
            `}
            >
              {service.status === "active"
                ? isRTL
                  ? "نشط"
                  : "Active"
                : isRTL
                  ? "غير نشط"
                  : "Inactive"}
            </span>
          </div>
        )}

        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </Link>
  );
}
