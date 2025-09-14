import ServiceCard from ".././home/ServiceCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useServices } from "@/hooks/useServices";

export default function ServicesList() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { services, loading, error } = useServices(language);

  // Default icons mapping for services
  const getServiceIcon = (serviceName: string) => {
    const iconMap: { [key: string]: string } = {
      'تصدير': '/images/service/icon3.svg',
      'Export': '/images/service/icon3.svg',
      'استيراد': '/images/service/icon4.svg',
      'Import': '/images/service/icon4.svg',
      'الشحن والخدمات اللوجستية': '/images/service/icon2.svg',
      'Shipping and Logistics Services': '/images/service/icon2.svg',
      'توفير الموردين أو المستوردين': '/images/service/icon1.svg',
      'Supplier or Importer Provision': '/images/service/icon1.svg',
    };
    return iconMap[serviceName] || '/images/service/icon1.svg';
  };

  // Fallback services data (always in Arabic, will be translated by API)
  const fallbackServices = [
    {
      id: "fallback-1",
      name: "تصدير",
      description: "ندعمك لتصدير منتجاتك للعالم بخدمات تغليف، أوراق، وشحن متكاملة.",
      features: ["تغليف احترافي", "أوراق رسمية", "شحن سريع", "متابعة التوريد"],
      status: "active" as const,
      Image: "/images/service/icon3.svg",
      isHighlighted: true,
    },
    {
      id: "fallback-2",
      name: "استيراد",
      description: "استيراد أمن وسهل من أي دولة، مع متابعة التوريد والتخليص والتسليم.",
      features: ["تخليص جمركي", "متابعة الشحن", "تسليم آمن", "دعم فني"],
      status: "active" as const,
      Image: "/images/service/icon4.svg",
      isHighlighted: false,
    },
    {
      id: "fallback-3",
      name: "الشحن والخدمات اللوجستية",
      description: "خيارات شحن متنوعة مع إدارة احترافية لسلاسل الإمداد.",
      features: ["شحن بحري", "شحن جوي", "تخزين مؤقت", "توزيع محلي"],
      status: "active" as const,
      Image: "/images/service/icon2.svg",
      isHighlighted: false,
    },
    {
      id: "fallback-4",
      name: "توفير الموردين أو المستوردين",
      description: "ربطك بموردين موثوقين أو مستوردين جادين لبناء شراكات ناجحة.",
      features: ["شبكة موردين", "فحص الجودة", "تفاوض الأسعار", "ضمان الجودة"],
      status: "active" as const,
      Image: "/images/service/icon1.svg",
      isHighlighted: false,
    },
  ];

  // Transform API data to match ServiceCard interface
  const transformedServices = services.length > 0 
    ? services.map((service, index) => {
        // Handle both string and translation object formats
        const serviceName = service.name || '';
        const serviceDescription = service.description || '';
        const serviceFeatures = service.features || [];
        
        // Extract text from translation objects for display
        const displayName = typeof serviceName === 'string' 
          ? serviceName 
          : serviceName?.[language] || serviceName?.ar || serviceName?.en || 'Service';
        
        const displayDescription = typeof serviceDescription === 'string' 
          ? serviceDescription 
          : serviceDescription?.[language] || serviceDescription?.ar || serviceDescription?.en || '';
        
        const displayFeatures = serviceFeatures.map((feature: any) => 
          typeof feature === 'string' 
            ? feature 
            : feature?.[language] || feature?.ar || feature?.en || ''
        );
        
        return {
          id: (service as any)._id || (service as any).id || `service-${index}`,
          name: displayName, // Always a string for display
          description: displayDescription, // Always a string for display
          features: displayFeatures, // Always array of strings for display
          status: service.status,
          Image: getServiceIcon(displayName),
          isHighlighted: index === 0, // Highlight first service
        };
      })
    : fallbackServices;

  return (
    <section className="w-full py-16 px-4 md:px-8 lg:px-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* Small title with line */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-0.5 bg-[var(--color-secondary)] dark:bg-[var(--color-secondary)]"></div>
            <h3
              className="text-[var(--color-secondary)] dark:text-[var(--color-secondary)] text-3xl font-bold mx-4"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {isRTL ? "خدماتنا" : "Our Services"}
            </h3>
            <div className="w-12 h-0.5 bg-[var(--color-secondary)] dark:bg-[var(--color-secondary)]"></div>
          </div>

          {/* Main title */}
          <h2
            className="text-3xl md:text-4xl font-bold mb-6"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {isRTL
              ? "خدمات متكاملة لتجارتك العالمية"
              : "Integrated services for your global trade"}
          </h2>

          {/* Description */}
          <p
            className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {isRTL
              ? "نقدم لك مجموعة متكاملة من خدمات الاستيراد والتصدير، تغطي كل ما تحتاجه لتوسع أعمالك بثقة وكفاءة."
              : "We offer you a comprehensive set of import and export services, covering everything you need to expand your business with confidence and efficiency."}
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              {isRTL ? "جاري تحميل الخدمات..." : "Loading services..."}
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {isRTL ? "خطأ في تحميل الخدمات" : "Error loading services"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              {isRTL ? "إعادة المحاولة" : "Retry"}
            </button>
          </div>
        ) : (
          <div>
            {/* Show indicator if using fallback data */}
            {services.length === 0 && !loading && !error && (
              <div className="text-center mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-sm">
                    {isRTL ? "عرض البيانات الافتراضية" : "Showing default data"}
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap justify-center gap-6">
              {transformedServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
