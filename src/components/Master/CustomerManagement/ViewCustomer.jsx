import React from "react";
import { 
  X, 
  FileText, 
  Download, 
  Building2, 
  Home, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar,
  User,
  Globe,
  Hash,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  File as FileIcon
} from "lucide-react";
import { useTheme } from "../../../ui/Settings/themeUtils";

// ────────────────────────────────────────────────
// API BASE URL — using environment variable or default
// ────────────────────────────────────────────────
const API_BASE = `${import.meta.env.VITE_API_CUSTOMER_URL}/api`;
console.log("Using API Base URL:", API_BASE);

const ViewCustomer = ({ customer, onClose }) => {
  const { themeUtils } = useTheme();

  // Early return if no data
  if (!customer) return null;

  // Handle different data structures
  const cust = customer.customer || customer;
  const units = customer.units || cust?.units || [];
  const documents = customer.documents || cust?.documents || [];

  const formatPhone = (phone) => {
    if (!phone) return "-";
    const cleaned = phone.replace(/\D/g, "");
    
    if (cleaned.startsWith("971") && cleaned.length === 12) {
      return `+${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
    }
    if (cleaned.startsWith("971") && cleaned.length === 9) {
      return `+971 ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
    }
    return phone;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const getDocumentUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith('http')) return url;
    const baseUrl = API_BASE.replace('/api', '');
    return `${baseUrl}${url}`;
  };

  const getFileIcon = (url, type) => {
    if (!url) return <FileText size={20} />;
    const ext = url.split('.').pop()?.toLowerCase();
    
    if (type?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
      return <ImageIcon size={20} />;
    }
    if (ext === 'pdf') return '📄';
    if (ext === 'doc' || ext === 'docx') return '📝';
    if (ext === 'xls' || ext === 'xlsx') return '📊';
    return <FileIcon size={20} />;
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'active':
      case 'sold':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Inactive</span>;
      case 'unsold':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Unsold</span>;
      case 'occupied':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Occupied</span>;
      case 'vacant':
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Vacant</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status || 'Unknown'}</span>;
    }
  };

  // Info Card Component for consistent styling
  const InfoCard = ({ icon: Icon, label, value, className = "" }) => (
    <div className={`p-3 rounded-lg border ${className}`} style={{ 
      borderColor: themeUtils.getBorderColor(),
      backgroundColor: themeUtils.getBgColor("input")
    }}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: themeUtils.getBgColor("primary", 0.1) }}>
          <Icon size={18} style={{ color: themeUtils.getTextColor(true) }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium mb-1" style={{ color: themeUtils.getTextColor(false) }}>
            {label}
          </p>
          <p className="text-sm font-semibold break-words" style={{ color: themeUtils.getTextColor(true) }}>
            {value || "-"}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col h-full rounded-lg"
      style={{ backgroundColor: themeUtils.getBgColor("default") }}
    >
      <div
        className="flex-1 overflow-y-auto p-4 lg:p-6"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile and Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Picture Card - UPDATED */}
            <div
              className="w-full p-5 rounded-lg border"
              style={{
                backgroundColor: themeUtils.getBgColor("input"),
                borderColor: themeUtils.getBorderColor(),
              }}
            >
              <h3
                className="text-sm font-medium mb-4 flex items-center gap-2"
                style={{ color: themeUtils.getTextColor(true) }}
              >
                <User size={16} />
                Profile Picture
              </h3>

              <div className="relative group">
                <img
                  src={
                    cust.profile_picture
                      ? (cust.profile_picture.startsWith('http') 
                          ? cust.profile_picture 
                          : `${API_BASE.replace('/api', '')}${cust.profile_picture}`)
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          cust.full_name || "Customer"
                        )}&background=8b5cf6&color=fff&size=200&bold=true&length=2`
                  }
                  alt={cust.full_name || "Customer"}
                  className="w-full aspect-square object-cover rounded-lg border-2"
                  style={{ borderColor: themeUtils.getBorderColor() }}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      cust.full_name || "Customer"
                    )}&background=8b5cf6&color=fff&size=200&bold=true&length=2`;
                  }}
                />
                {cust.is_active !== undefined && (
                  <div className="absolute top-2 right-2">
                    {cust.is_active ? (
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                        <CheckCircle size={12} />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium">
                        <XCircle size={12} />
                        Inactive
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="text-center p-2 rounded-lg" style={{ backgroundColor: themeUtils.getBgColor("default") }}>
                  <p className="text-xs" style={{ color: themeUtils.getTextColor(false) }}>Total Units</p>
                  <p className="text-lg font-bold" style={{ color: themeUtils.getTextColor(true) }}>{units.length}</p>
                </div>
                <div className="text-center p-2 rounded-lg" style={{ backgroundColor: themeUtils.getBgColor("default") }}>
                  <p className="text-xs" style={{ color: themeUtils.getTextColor(false) }}>Documents</p>
                  <p className="text-lg font-bold" style={{ color: themeUtils.getTextColor(true) }}>{documents.length}</p>
                </div>
              </div>
            </div>

            {/* Customer ID Card */}
            <div
              className="w-full p-5 rounded-lg border"
              style={{
                backgroundColor: themeUtils.getBgColor("input"),
                borderColor: themeUtils.getBorderColor(),
              }}
            >
              <h3
                className="text-sm font-medium mb-3 flex items-center gap-2"
                style={{ color: themeUtils.getTextColor(true) }}
              >
                <Hash size={16} />
                Customer Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1 border-b" style={{ borderColor: themeUtils.getBorderColor() }}>
                  <span className="text-xs" style={{ color: themeUtils.getTextColor(false) }}>Customer ID</span>
                  <span className="text-sm font-mono font-semibold" style={{ color: themeUtils.getTextColor(true) }}>
                    #{String(cust.customer_id).padStart(5, '0')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-xs" style={{ color: themeUtils.getTextColor(false) }}>Joined Date</span>
                  <span className="text-sm" style={{ color: themeUtils.getTextColor(true) }}>
                    {formatDate(cust.joining_date)}
                  </span>
                </div>
                {cust.created_at && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs" style={{ color: themeUtils.getTextColor(false) }}>Created</span>
                    <span className="text-xs" style={{ color: themeUtils.getTextColor(true) }}>
                      {formatDateTime(cust.created_at)}
                    </span>
                  </div>
                )}
                {cust.updated_at && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs" style={{ color: themeUtils.getTextColor(false) }}>Last Updated</span>
                    <span className="text-xs" style={{ color: themeUtils.getTextColor(true) }}>
                      {formatDateTime(cust.updated_at)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - All Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Details Section */}
            <div>
              <h3
                className="text-lg font-bold mb-4 flex items-center gap-2 pb-2 border-b"
                style={{ 
                  color: themeUtils.getTextColor(true),
                  borderColor: themeUtils.getBorderColor() 
                }}
              >
                <User size={20} />
                Personal Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard 
                  icon={User}
                  label="Full Name"
                  value={cust.full_name}
                />
                <InfoCard 
                  icon={User}
                  label="Gender"
                  value={cust.gender}
                />
                <InfoCard 
                  icon={Mail}
                  label="Email Address"
                  value={cust.email}
                />
                <InfoCard 
                  icon={Phone}
                  label="Contact Number"
                  value={formatPhone(cust.contact_number)}
                />
              </div>
            </div>

            {/* Address Details Section */}
            <div>
              <h3
                className="text-lg font-bold mb-4 flex items-center gap-2 pb-2 border-b"
                style={{ 
                  color: themeUtils.getTextColor(true),
                  borderColor: themeUtils.getBorderColor() 
                }}
              >
                <MapPin size={20} />
                Address Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard 
                  icon={Globe}
                  label="Country"
                  value={cust.country_name || cust.country}
                />
                <InfoCard 
                  icon={MapPin}
                  label="City"
                  value={cust.city_name || cust.city}
                />
                <div className="md:col-span-2">
                  <InfoCard 
                    icon={Home}
                    label="Address Line 1"
                    value={cust.address_line1}
                  />
                </div>
                {cust.address_line2 && (
                  <div className="md:col-span-2">
                    <InfoCard 
                      icon={Home}
                      label="Address Line 2"
                      value={cust.address_line2}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Allocated Units Section */}
            <div>
              <h3
                className="text-lg font-bold mb-4 flex items-center gap-2 pb-2 border-b"
                style={{ 
                  color: themeUtils.getTextColor(true),
                  borderColor: themeUtils.getBorderColor() 
                }}
              >
                <Building2 size={20} />
                Allocated Units
                {units.length > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                    {units.length} Unit{units.length > 1 ? 's' : ''}
                  </span>
                )}
              </h3>
              
              {units.length === 0 ? (
                <div className="text-center py-8 rounded-lg border" style={{ 
                  borderColor: themeUtils.getBorderColor(),
                  backgroundColor: themeUtils.getBgColor("input")
                }}>
                  <Building2 size={40} className="mx-auto mb-2" style={{ color: themeUtils.getTextColor(false, true) }} />
                  <p className="text-sm" style={{ color: themeUtils.getTextColor(false) }}>
                    No units allocated to this customer
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {units.map((unit, index) => (
                    <div
                      key={unit.unit_id || index}
                      className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                      style={{
                        borderColor: themeUtils.getBorderColor(),
                        backgroundColor: themeUtils.getBgColor("input"),
                      }}
                    >
                      {/* Unit Header */}
                      <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: themeUtils.getBorderColor() }}>
                        <div className="flex items-center gap-2">
                          <Home size={18} style={{ color: themeUtils.getTextColor(false) }} />
                          <span className="font-semibold" style={{ color: themeUtils.getTextColor(true) }}>
                            Unit {unit.unit_number}
                          </span>
                        </div>
                        {unit.status && getStatusBadge(unit.status)}
                      </div>

                      {/* Unit Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Unit Number */}
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: themeUtils.getTextColor(false) }}>
                            Unit Details
                          </label>
                          <p className="text-sm" style={{ color: themeUtils.getTextColor(true) }}>
                            {[
                              unit.unit_number,
                              unit.floor_number && `Floor ${unit.floor_number}`,
                              unit.unit_type
                            ].filter(Boolean).join(' • ')}
                          </p>
                          {unit.area_sqft && (
                            <p className="text-xs mt-1" style={{ color: themeUtils.getTextColor(false) }}>
                              Area: {unit.area_sqft} sq.ft
                            </p>
                          )}
                        </div>

                        {/* Building Details */}
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: themeUtils.getTextColor(false) }}>
                            Building / Property
                          </label>
                          <p className="text-sm font-medium" style={{ color: themeUtils.getTextColor(true) }}>
                            {unit.building_name || "-"}
                          </p>
                          {unit.building_code && (
                            <p className="text-xs mt-1" style={{ color: themeUtils.getTextColor(false) }}>
                              Code: {unit.building_code}
                            </p>
                          )}
                        </div>

                        {/* Community Details */}
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: themeUtils.getTextColor(false) }}>
                            Community
                          </label>
                          <p className="text-sm font-medium" style={{ color: themeUtils.getTextColor(true) }}>
                            {unit.community_name || "-"}
                          </p>
                          {unit.community_code && (
                            <p className="text-xs mt-1" style={{ color: themeUtils.getTextColor(false) }}>
                              Code: {unit.community_code}
                            </p>
                          )}
                          {(unit.community_city || unit.community_country) && (
                            <p className="text-xs" style={{ color: themeUtils.getTextColor(false) }}>
                              {[unit.community_city, unit.community_country].filter(Boolean).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Additional Unit Info */}
                      {(unit.is_occupied !== undefined || unit.status) && (
                        <div className="mt-3 pt-3 border-t flex gap-4" style={{ borderColor: themeUtils.getBorderColor() }}>
                          {unit.is_occupied !== undefined && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs" style={{ color: themeUtils.getTextColor(false) }}>Occupied:</span>
                              {unit.is_occupied ? (
                                <span className="text-xs text-green-600">Yes</span>
                              ) : (
                                <span className="text-xs text-gray-500">No</span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Documents Section */}
            <div>
              <h3
                className="text-lg font-bold mb-4 flex items-center gap-2 pb-2 border-b"
                style={{ 
                  color: themeUtils.getTextColor(true),
                  borderColor: themeUtils.getBorderColor() 
                }}
              >
                <FileText size={20} />
                Documents
                {documents.length > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {documents.length} Document{documents.length > 1 ? 's' : ''}
                  </span>
                )}
              </h3>

              {documents.length === 0 ? (
                <div className="text-center py-8 rounded-lg border" style={{ 
                  borderColor: themeUtils.getBorderColor(),
                  backgroundColor: themeUtils.getBgColor("input")
                }}>
                  <FileText size={40} className="mx-auto mb-2" style={{ color: themeUtils.getTextColor(false, true) }} />
                  <p className="text-sm" style={{ color: themeUtils.getTextColor(false) }}>
                    No documents uploaded for this customer
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc, index) => {
                    // Find associated unit
                    const associatedUnit = units.find(u => u.unit_id === doc.unit_id);
                    
                    return (
                      <div
                        key={doc.document_id || index}
                        className="p-4 rounded-lg border hover:shadow-md transition-all group"
                        style={{
                          borderColor: themeUtils.getBorderColor(),
                          backgroundColor: themeUtils.getBgColor("input"),
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: themeUtils.getBgColor("primary", 0.1) }}>
                            <span className="text-xl">
                              {getFileIcon(doc.document_url)}
                            </span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm mb-1 truncate" style={{ color: themeUtils.getTextColor(true) }}>
                              {doc.description || `Document ${index + 1}`}
                            </p>
                            
                            {/* Document Metadata */}
                            <div className="space-y-1">
                              {doc.unit_id && associatedUnit && (
                                <p className="text-xs flex items-center gap-1 flex-wrap">
                                  <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                                    Unit: {associatedUnit.unit_number}
                                  </span>
                                  {associatedUnit.building_name && (
                                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                      {associatedUnit.building_name}
                                    </span>
                                  )}
                                </p>
                              )}
                              
                              {doc.created_at && (
                                <p className="text-xs flex items-center gap-1" style={{ color: themeUtils.getTextColor(false) }}>
                                  <Calendar size={10} />
                                  {formatDate(doc.created_at)}
                                </p>
                              )}
                            </div>
                          </div>

                          <a
                            href={getDocumentUrl(doc.document_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{
                              backgroundColor: themeUtils.getBgColor("primary", 0.1),
                              color: themeUtils.getTextColor(true),
                            }}
                            title="View Document"
                          >
                            <Download size={18} />
                          </a>
                        </div>

                        {/* Document Preview for Images */}
                        {doc.document_url?.match(/\.(jpg|jpeg|png|webp)$/i) && (
                          <div className="mt-3 pt-3 border-t" style={{ borderColor: themeUtils.getBorderColor() }}>
                            <img
                              src={getDocumentUrl(doc.document_url)}
                              alt={doc.description || "Document preview"}
                              className="w-full h-32 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="p-4 border-t flex justify-end gap-3 sticky bottom-0"
        style={{ 
          borderColor: themeUtils.getBorderColor(),
          backgroundColor: themeUtils.getBgColor("default")
        }}
      >
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-lg font-medium transition-all hover:opacity-80 flex items-center gap-2"
          style={{
            backgroundColor: themeUtils.getBgColor("secondary"),
            color: themeUtils.getTextColor(true),
          }}
        >
          <X size={18} />
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewCustomer;