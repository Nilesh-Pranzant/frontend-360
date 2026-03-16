import React, { useState, useEffect } from "react";
import { 
  Upload, 
  X, 
  Building2, 
  Home, 
  MapPin, 
  Plus, 
  Trash2,
  FileText,
  Download,
  Eye,
  Edit,
  Save,
  Image as ImageIcon,
  File as FileIcon,
  Calendar
} from "lucide-react";
import { useTheme } from "../../../ui/Settings/themeUtils";
import { useToast } from "../../../ui/common/CostumeTost";
import Button from "../../../ui/common/Button.jsx";
import CommonDialog from "../../../ui/common/CommonDialog";

// ────────────────────────────────────────────────
// API Configuration
// ────────────────────────────────────────────────
const API_BASE = `${import.meta.env.VITE_API_CUSTOMER_URL}/api`;
console.log("Using API Base URL:", API_BASE);

const EditCustomer = ({ customer, onClose, onSuccess }) => {
  const { themeUtils } = useTheme();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // File upload states
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  // Dropdown data states
  const [communities, setCommunities] = useState([]);
  const [propertiesByCommunity, setPropertiesByCommunity] = useState({});
  const [unitsByProperty, setUnitsByProperty] = useState({});

  // Location states
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState("");

  // Document viewing/editing states
  const [viewDocument, setViewDocument] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null);
  const [isDocumentViewOpen, setIsDocumentViewOpen] = useState(false);
  const [isDocumentEditOpen, setIsDocumentEditOpen] = useState(false);

  // Multiple allocations
  const [allocations, setAllocations] = useState([]);
  
  // Documents state
  const [documents, setDocuments] = useState([]);
  const [newDocuments, setNewDocuments] = useState([]);
  const [deletedDocuments, setDeletedDocuments] = useState([]);

  const [form, setForm] = useState({
    full_name: "",
    gender: "",
    email: "",
    contact_number: "",
    country: "",
    city: "",
    address_line1: "",
    address_line2: "",
    joining_date: "",
  });

  const [errors, setErrors] = useState({
    full_name: "",
    email: "",
    contact_number: "",
    address_line1: "",
    country: "",
  });

  // ─── Debug customer prop ───────────────────────────────
  useEffect(() => {
    console.log("EditCustomer received customer prop:", customer);
  }, [customer]);

  // ─── Load initial customer data ───────────────────────────────
  useEffect(() => {
    if (!customer) {
      console.error("No customer prop provided");
      toast.error("Error", "No customer data received");
      onClose?.();
      setFetchLoading(false);
      return;
    }

    const customerId = customer.customer_id || customer?.customer?.customer_id;
    
    if (!customerId) {
      console.error("Customer has no ID:", customer);
      toast.error("Error", "Invalid customer data - missing ID");
      onClose?.();
      setFetchLoading(false);
      return;
    }

    const loadCustomer = async () => {
      try {
        setFetchLoading(true);

        const res = await fetch(`${API_BASE}/customers/${customerId}`);
        if (!res.ok) {
          throw new Error(`Failed to load customer (HTTP ${res.status})`);
        }

        const json = await res.json();
        console.log("Single customer API response:", json);

        let custData = json.data || json;
        let cust = custData.customer || custData;

        if (!cust || !cust.customer_id) {
          throw new Error("Unable to load customer data");
        }

        // Clean phone number
        let contact = (cust.contact_number || "").trim();
        contact = contact.replace(/^\+971|^971|^0/, "");

        // Format date for input type="date"
        const formattedJoinDate = cust.joining_date
          ? new Date(cust.joining_date).toISOString().split("T")[0]
          : "";

        // Get all units
        const units = custData.units || cust.units || [];
        console.log("Customer units:", units);

        // Create allocations from units
        const initialAllocations = units.map((unit, index) => ({
          id: Date.now() + index,
          community_id: unit.community_id ? String(unit.community_id) : "",
          property_id: unit.building_id ? String(unit.building_id) : "",
          unit_id: unit.unit_id ? String(unit.unit_id) : "",
          unit_number: unit.unit_number || "",
          building_name: unit.building_name || "",
          community_name: unit.community_name || "",
        }));

        // If no units, add one empty allocation
        if (initialAllocations.length === 0) {
          initialAllocations.push({
            id: Date.now(),
            community_id: "",
            property_id: "",
            unit_id: "",
            unit_number: "",
            building_name: "",
            community_name: "",
          });
        }

        setAllocations(initialAllocations);

        // Set documents
        const docs = custData.documents || cust.documents || [];
        setDocuments(docs);

        // Set country ID
        let countryId = cust.country_id || cust.country;
        if (countryId && isNaN(Number(countryId))) {
          countryId = "";
        }

        setForm({
          full_name: cust.full_name || "",
          gender: cust.gender || "",
          email: cust.email || "",
          contact_number: contact,
          country: countryId ? String(countryId) : "",
          city: cust.city_id ? String(cust.city_id) : "",
          address_line1: cust.address_line1 || "",
          address_line2: cust.address_line2 || "",
          joining_date: formattedJoinDate,
        });

        if (countryId) {
          setSelectedCountryId(String(countryId));
        }

        // Profile picture
        if (cust.profile_picture) {
          const imgPath = cust.profile_picture.startsWith("http")
            ? cust.profile_picture
            : `${API_BASE.replace("/api", "")}${cust.profile_picture}`;
          setExistingImage(imgPath);
        }

      } catch (err) {
        console.error("Error loading customer:", err);
        toast.error("Error", err.message || "Failed to load customer data");
      } finally {
        setFetchLoading(false);
      }
    };

    loadCustomer();
  }, [customer]);

  // ─── Fetch countries ───────────────────────────────
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(`${API_BASE}/location/countries`);
        if (!res.ok) throw new Error("Failed to load countries");
        const data = await res.json();
        setCountries(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Error", "Failed to load countries");
      }
    };
    fetchCountries();
  }, []);

  // ─── Fetch cities when country changes ───────────────────────────────
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountryId) {
        setCities([]);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/location/cities/${selectedCountryId}`);
        if (!res.ok) throw new Error("Failed to load cities");
        const data = await res.json();
        setCities(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Error", "Failed to load cities");
      }
    };
    fetchCities();
  }, [selectedCountryId]);

  // ─── Fetch communities ───────────────────────────────
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await fetch(`${API_BASE}/communities`);
        if (!res.ok) throw new Error("Failed to load communities");
        const data = await res.json();
        setCommunities(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Error", "Failed to load communities");
      }
    };
    fetchCommunities();
  }, []);

  // ─── Fetch properties when community changes for each allocation ─────
  useEffect(() => {
    const fetchMissingProperties = async () => {
      for (const alloc of allocations) {
        const cid = alloc.community_id;
        if (!cid || propertiesByCommunity[cid]) continue;

        try {
          const res = await fetch(`${API_BASE}/properties/by-community/${cid}`);
          if (!res.ok) throw new Error("Failed to load properties");
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.data || [];
          
          setPropertiesByCommunity(prev => ({
            ...prev,
            [cid]: list.map(p => ({
              ...p,
              property_id: p.property_id || p.building_id
            }))
          }));
        } catch (err) {
          console.error(err);
          toast.error("Error", "Failed to load properties");
        }
      }
    };
    fetchMissingProperties();
  }, [allocations.map(a => a.community_id).join(',')]);

  // ─── Fetch units when property changes for each allocation ──────────
  useEffect(() => {
    const fetchMissingUnits = async () => {
      for (const alloc of allocations) {
        const pid = alloc.property_id;
        if (!pid || unitsByProperty[pid]) continue;

        try {
          const res = await fetch(`${API_BASE}/units/by-property/${pid}`);
          if (!res.ok) throw new Error("Failed to load units");
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.data || [];
          
          setUnitsByProperty(prev => ({
            ...prev,
            [pid]: list
          }));
        } catch (err) {
          console.error(err);
          toast.error("Error", "Failed to load units");
        }
      }
    };
    fetchMissingUnits();
  }, [allocations.map(a => a.property_id).join(',')]);

  // ─── File handlers for profile picture ───────────────────────────────
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const valid = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!valid.includes(selected.type)) {
      toast.error("Invalid File", "JPG, PNG, WEBP only");
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      toast.error("Too Large", "Max 5MB");
      return;
    }

    setFile(selected);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(selected);
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
    setExistingImage(null);
    const input = document.getElementById("customer-image");
    if (input) input.value = "";
  };

  // ─── Document handlers ───────────────────────────────
  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const valid = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
      if (!valid.includes(file.type)) {
        toast.error("Invalid File", `${file.name} - JPG, PNG, WEBP, PDF only`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Too Large", `${file.name} - Max 5MB`);
        return;
      }

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewDocuments(prev => [...prev, {
            id: Date.now() + Math.random(),
            file,
            preview: reader.result,
            description: "",
            unit_id: "",
            isNew: true
          }]);
        };
        reader.readAsDataURL(file);
      } else {
        setNewDocuments(prev => [...prev, {
          id: Date.now() + Math.random(),
          file,
          preview: null,
          description: "",
          unit_id: "",
          isNew: true
        }]);
      }
    });
  };

  const handleDocumentDelete = (doc) => {
    if (doc.isNew) {
      // Remove from new documents
      setNewDocuments(prev => prev.filter(d => d.id !== doc.id));
    } else {
      // Mark existing document for deletion
      setDeletedDocuments(prev => [...prev, doc.document_id]);
      setDocuments(prev => prev.filter(d => d.document_id !== doc.document_id));
    }
    toast.success("Success", "Document removed");
  };

  const handleDocumentUpdate = (updatedDoc) => {
    if (updatedDoc.isNew) {
      setNewDocuments(prev => prev.map(d => 
        d.id === updatedDoc.id ? updatedDoc : d
      ));
    } else {
      setDocuments(prev => prev.map(d => 
        d.document_id === updatedDoc.document_id ? updatedDoc : d
      ));
    }
    setIsDocumentEditOpen(false);
    setEditingDocument(null);
    toast.success("Success", "Document updated");
  };

  const getDocumentUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith('http')) return url;
    return `${API_BASE.replace('/api', '')}${url}`;
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

  // ─── Allocation handlers ───────────────────────────────
  const addAllocation = () => {
    setAllocations(prev => [
      ...prev,
      {
        id: Date.now(),
        community_id: "",
        property_id: "",
        unit_id: "",
        unit_number: "",
        building_name: "",
        community_name: "",
      }
    ]);
  };

  const removeAllocation = (id) => {
    if (allocations.length === 1) {
      toast.info("Info", "At least one allocation is required");
      return;
    }
    setAllocations(prev => prev.filter(a => a.id !== id));
  };

  const updateAllocation = (id, field, value) => {
    setAllocations(prev =>
      prev.map(alloc =>
        alloc.id === id ? { ...alloc, [field]: value } : alloc
      )
    );

    if (field === "community_id") {
      setAllocations(prev =>
        prev.map(alloc =>
          alloc.id === id
            ? { ...alloc, property_id: "", unit_id: "" }
            : alloc
        )
      );
    }
    if (field === "property_id") {
      setAllocations(prev =>
        prev.map(alloc =>
          alloc.id === id ? { ...alloc, unit_id: "" } : alloc
        )
      );
    }
  };

  // ─── Validation ───────────────────────────────
  const validateField = (name, value) => {
    switch (name) {
      case "full_name":
        if (!value?.trim()) return "Full name required";
        if (value.trim().length < 2) return "Min 2 chars";
        if (value.trim().length > 100) return "Max 100 chars";
        return "";
      case "email":
        if (!value?.trim()) return "Email required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email";
        return "";
      case "contact_number":
        if (!value?.trim()) return "Contact required";
        if (!/^\d{7,15}$/.test(value.replace(/\D/g, ''))) return "7–15 digits only";
        return "";
      case "address_line1":
        if (!value?.trim()) return "Address line 1 required";
        if (value.trim().length > 200) return "Max 200 chars";
        return "";
      case "country":
        if (!value) return "Country required";
        return "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    ["full_name", "email", "contact_number", "address_line1", "country"].forEach(field => {
      const err = validateField(field, form[field]);
      if (err) newErrors[field] = err;
    });

    // Check if at least one allocation has a unit
    const hasValidAllocation = allocations.some(a => a.unit_id);
    if (!hasValidAllocation) {
      toast.error("Error", "At least one unit allocation is required");
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    if (field === "country") {
      setSelectedCountryId(value);
      setForm(prev => ({ ...prev, city: "" }));
    }
    
    setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
  };

  // ─── Submit ───────────────────────────────
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Personal details
      formData.append("full_name", form.full_name.trim());
      formData.append("gender", form.gender || "");
      formData.append("email", form.email.trim());

      // Format phone number
      let phone = form.contact_number.trim().replace(/\D/g, "");
      if (phone) {
        if (!phone.startsWith("971")) {
          phone = `971${phone}`;
        }
      }
      formData.append("contact_number", phone);

      // Address
      formData.append("country", form.country || "");
      formData.append("city", form.city || "");
      formData.append("address_line1", form.address_line1.trim());
      formData.append("address_line2", form.address_line2?.trim() || "");
      formData.append("joining_date", form.joining_date || "");

      // Add all allocations
      allocations.forEach((alloc, index) => {
        formData.append(`community_id_${index}`, alloc.community_id || "");
        formData.append(`property_id_${index}`, alloc.property_id || "");
        formData.append(`unit_id_${index}`, alloc.unit_id || "");
      });

      // Add deleted documents
      if (deletedDocuments.length > 0) {
        formData.append("deleted_documents", JSON.stringify(deletedDocuments));
      }

      // Add new documents
      newDocuments.forEach((doc, index) => {
        formData.append(`document_new_${index}`, doc.file);
        formData.append(`description_new_${index}`, doc.description || "");
        formData.append(`document_unit_new_${index}`, doc.unit_id || "");
      });

      // Profile picture
      if (file) {
        formData.append("profile_picture", file);
      }

      const customerId = customer.customer_id || customer?.customer?.customer_id;
      
      const res = await fetch(`${API_BASE}/customers/${customerId}`, {
        method: "PUT",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || `Update failed (${res.status})`);
      }

      toast.success("Success", "Customer updated successfully");
      onSuccess?.();
      onClose?.();

    } catch (err) {
      console.error("Update error:", err);
      toast.error("Error", err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4" style={{ color: themeUtils.getTextColor(false) }}>
          Loading customer details...
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full rounded-lg"
      style={{ backgroundColor: themeUtils.getBgColor("default") }}
    >
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture */}
          <div className="lg:col-span-1">
            <div
              className="p-5 rounded-lg border sticky top-0"
              style={{
                backgroundColor: themeUtils.getBgColor("input"),
                borderColor: themeUtils.getBorderColor(),
              }}
            >
              <h3 className="text-sm font-medium mb-4" style={{ color: themeUtils.getTextColor(true) }}>
                Profile Picture
              </h3>

              {(previewUrl || existingImage) ? (
                <div className="relative">
                  <img
                    src={previewUrl || existingImage}
                    alt="Profile"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={e => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(form.full_name || "Customer")}&background=8b5cf6&color=fff&size=200`;
                    }}
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                    type="button"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  style={{ borderColor: themeUtils.getBorderColor() }}
                  onClick={() => document.getElementById("customer-image")?.click()}
                >
                  <Upload size={32} className="mx-auto mb-3" style={{ color: themeUtils.getTextColor(false, true) }} />
                  <p className="text-sm font-medium mb-1" style={{ color: themeUtils.getTextColor(true) }}>
                    Click to upload
                  </p>
                  <p className="text-xs" style={{ color: themeUtils.getTextColor(false, true) }}>
                    JPG, PNG, WEBP (max 5MB)
                  </p>
                </div>
              )}

              <input
                id="customer-image"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: themeUtils.getTextColor(true) }}>
                <Building2 size={20} />
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm font-medium" style={{ color: themeUtils.getTextColor(false) }}>
                      Full Name *
                    </label>
                    <span className="text-xs" style={{ color: themeUtils.getTextColor(false, true) }}>
                      {form.full_name.length}/100
                    </span>
                  </div>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={e => handleInputChange("full_name", e.target.value)}
                    maxLength={100}
                    className={`w-full px-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                      errors.full_name ? "border-red-500" : ""
                    }`}
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      borderColor: errors.full_name ? "#ef4444" : themeUtils.getBorderColor(),
                      color: themeUtils.getTextColor(true),
                    }}
                    placeholder="Enter full name"
                  />
                  {errors.full_name && <p className="mt-1 text-xs text-red-500">⚠ {errors.full_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                    Gender
                  </label>
                  <select
                    value={form.gender}
                    onChange={e => handleInputChange("gender", e.target.value)}
                    className="w-full px-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      borderColor: themeUtils.getBorderColor(),
                      color: themeUtils.getTextColor(true),
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => handleInputChange("email", e.target.value)}
                    className={`w-full px-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      borderColor: errors.email ? "#ef4444" : themeUtils.getBorderColor(),
                      color: themeUtils.getTextColor(true),
                    }}
                    placeholder="customer@example.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">⚠ {errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={form.contact_number}
                    onChange={e => handleInputChange("contact_number", e.target.value.replace(/\D/g, '').slice(0, 15))}
                    className={`w-full px-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                      errors.contact_number ? "border-red-500" : ""
                    }`}
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      borderColor: errors.contact_number ? "#ef4444" : themeUtils.getBorderColor(),
                      color: themeUtils.getTextColor(true),
                    }}
                    placeholder="501234567"
                  />
                  {errors.contact_number && <p className="mt-1 text-xs text-red-500">⚠ {errors.contact_number}</p>}
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: themeUtils.getTextColor(true) }}>
                <MapPin size={20} />
                Address Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                    Country *
                  </label>
                  <select
                    value={form.country}
                    onChange={e => handleInputChange("country", e.target.value)}
                    className={`w-full px-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                      errors.country ? "border-red-500" : ""
                    }`}
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      borderColor: errors.country ? "#ef4444" : themeUtils.getBorderColor(),
                      color: themeUtils.getTextColor(true),
                    }}
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country.country_id} value={country.country_id}>
                        {country.country_name}
                      </option>
                    ))}
                  </select>
                  {errors.country && <p className="mt-1 text-xs text-red-500">⚠ {errors.country}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                    City
                  </label>
                  <select
                    value={form.city}
                    onChange={e => handleInputChange("city", e.target.value)}
                    disabled={!selectedCountryId}
                    className="w-full px-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      borderColor: themeUtils.getBorderColor(),
                      color: themeUtils.getTextColor(true),
                    }}
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city.city_id} value={city.city_id}>
                        {city.city_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm font-medium" style={{ color: themeUtils.getTextColor(false) }}>
                      Address Line 1 *
                    </label>
                    <span className="text-xs" style={{ color: themeUtils.getTextColor(false, true) }}>
                      {form.address_line1.length}/200
                    </span>
                  </div>
                  <input
                    type="text"
                    value={form.address_line1}
                    onChange={e => handleInputChange("address_line1", e.target.value)}
                    maxLength={200}
                    className={`w-full px-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                      errors.address_line1 ? "border-red-500" : ""
                    }`}
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      borderColor: errors.address_line1 ? "#ef4444" : themeUtils.getBorderColor(),
                      color: themeUtils.getTextColor(true),
                    }}
                    placeholder="Street address, P.O. box..."
                  />
                  {errors.address_line1 && <p className="mt-1 text-xs text-red-500">⚠ {errors.address_line1}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={form.address_line2}
                    onChange={e => handleInputChange("address_line2", e.target.value)}
                    className="w-full px-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      borderColor: themeUtils.getBorderColor(),
                      color: themeUtils.getTextColor(true),
                    }}
                    placeholder="Apartment, suite, floor..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                    Joining Date
                  </label>
                  <input
                    type="date"
                    value={form.joining_date}
                    onChange={e => handleInputChange("joining_date", e.target.value)}
                    className="w-full px-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      borderColor: themeUtils.getBorderColor(),
                      color: themeUtils.getTextColor(true),
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Multiple Unit Allocations */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: themeUtils.getTextColor(true) }}>
                  <Home size={20} />
                  Unit Allocations
                </h3>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Plus}
                  onClick={addAllocation}
                  className="text-sm"
                >
                  Add Unit
                </Button>
              </div>

              <div className="space-y-6">
                {allocations.map((alloc, index) => (
                  <div
                    key={alloc.id}
                    className="p-4 rounded-lg border relative"
                    style={{
                      borderColor: themeUtils.getBorderColor(),
                      backgroundColor: themeUtils.getBgColor("input"),
                    }}
                  >
                    {allocations.length > 1 && (
                      <button
                        onClick={() => removeAllocation(alloc.id)}
                        className="absolute top-2 right-2 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        type="button"
                        title="Remove this unit"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                          Community
                        </label>
                        <select
                          value={alloc.community_id}
                          onChange={e => updateAllocation(alloc.id, "community_id", e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                          style={{
                            backgroundColor: themeUtils.getBgColor("default"),
                            borderColor: themeUtils.getBorderColor(),
                            color: themeUtils.getTextColor(true),
                          }}
                        >
                          <option value="">Select Community</option>
                          {communities.map(comm => (
                            <option key={comm.community_id} value={comm.community_id}>
                              {comm.community_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                          Property
                        </label>
                        <select
                          value={alloc.property_id}
                          onChange={e => updateAllocation(alloc.id, "property_id", e.target.value)}
                          disabled={!alloc.community_id}
                          className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
                          style={{
                            backgroundColor: themeUtils.getBgColor("default"),
                            borderColor: themeUtils.getBorderColor(),
                            color: themeUtils.getTextColor(true),
                          }}
                        >
                          <option value="">Select Property</option>
                          {(propertiesByCommunity[alloc.community_id] || []).map(prop => (
                            <option key={prop.property_id} value={prop.property_id}>
                              {prop.property_name || prop.building_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                          Unit
                        </label>
                        <select
                          value={alloc.unit_id}
                          onChange={e => updateAllocation(alloc.id, "unit_id", e.target.value)}
                          disabled={!alloc.property_id}
                          className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
                          style={{
                            backgroundColor: themeUtils.getBgColor("default"),
                            borderColor: themeUtils.getBorderColor(),
                            color: themeUtils.getTextColor(true),
                          }}
                        >
                          <option value="">Select Unit</option>
                          {(unitsByProperty[alloc.property_id] || []).map(unit => (
                            <option key={unit.unit_id} value={unit.unit_id}>
                              {unit.unit_number}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Display current unit info if available */}
                    {alloc.unit_number && (
                      <div className="mt-3 pt-3 border-t text-xs" style={{ borderColor: themeUtils.getBorderColor() }}>
                        <span className="font-medium" style={{ color: themeUtils.getTextColor(false) }}>
                          Currently: 
                        </span>
                        <span className="ml-2" style={{ color: themeUtils.getTextColor(true) }}>
                          {alloc.unit_number} 
                          {alloc.building_name && ` in ${alloc.building_name}`}
                          {alloc.community_name && `, ${alloc.community_name}`}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: themeUtils.getTextColor(true) }}>
                  <FileText size={20} />
                  Documents
                </h3>
                <div className="flex gap-2">
                  <input
                    type="file"
                    id="document-upload"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                    onChange={handleDocumentUpload}
                    className="hidden"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Upload}
                    onClick={() => document.getElementById("document-upload")?.click()}
                    className="text-sm"
                  >
                    Upload Documents
                  </Button>
                </div>
              </div>

              {/* Existing Documents */}
              {documents.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3" style={{ color: themeUtils.getTextColor(false) }}>
                    Existing Documents ({documents.length})
                  </h4>
                  <div className="space-y-3">
                    {documents.map(doc => (
                      <div
                        key={doc.document_id}
                        className="p-3 rounded-lg border hover:shadow-md transition-all group"
                        style={{
                          borderColor: themeUtils.getBorderColor(),
                          backgroundColor: themeUtils.getBgColor("input"),
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: themeUtils.getBgColor("primary", 0.1) }}>
                              <span className="text-xl">
                                {getFileIcon(doc.document_url)}
                              </span>
                            </div>
                            
                            <div className="flex-1">
                              <p className="font-medium text-sm" style={{ color: themeUtils.getTextColor(true) }}>
                                {doc.description || `Document`}
                              </p>
                              
                              <div className="flex items-center gap-3 mt-1">
                                {doc.unit_id && (
                                  <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                                    Unit: {allocations.find(a => a.unit_id === String(doc.unit_id))?.unit_number || doc.unit_id}
                                  </span>
                                )}
                                {doc.created_at && (
                                  <span className="text-xs flex items-center gap-1" style={{ color: themeUtils.getTextColor(false) }}>
                                    <Calendar size={10} />
                                    {formatDate(doc.created_at)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setViewDocument(doc);
                                setIsDocumentViewOpen(true);
                              }}
                              className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
                              style={{
                                backgroundColor: themeUtils.getBgColor("primary", 0.1),
                                color: themeUtils.getTextColor(true),
                              }}
                              title="View Document"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingDocument(doc);
                                setIsDocumentEditOpen(true);
                              }}
                              className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
                              style={{
                                backgroundColor: themeUtils.getBgColor("warning", 0.1),
                                color: themeUtils.getTextColor(true),
                              }}
                              title="Edit Document"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDocumentDelete(doc)}
                              className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
                              style={{
                                backgroundColor: themeUtils.getBgColor("danger", 0.1),
                                color: themeUtils.getTextColor(true),
                              }}
                              title="Delete Document"
                            >
                              <Trash2 size={16} />
                            </button>
                            <a
                              href={getDocumentUrl(doc.document_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
                              style={{
                                backgroundColor: themeUtils.getBgColor("success", 0.1),
                                color: themeUtils.getTextColor(true),
                              }}
                              title="Download Document"
                            >
                              <Download size={16} />
                            </a>
                          </div>
                        </div>

                        {/* Image Preview for images */}
                        {doc.document_url?.match(/\.(jpg|jpeg|png|webp)$/i) && (
                          <div className="mt-3 pt-3 border-t" style={{ borderColor: themeUtils.getBorderColor() }}>
                            <img
                              src={getDocumentUrl(doc.document_url)}
                              alt={doc.description || "Document preview"}
                              className="max-h-32 rounded-lg object-contain"
                              onClick={() => {
                                setViewDocument(doc);
                                setIsDocumentViewOpen(true);
                              }}
                              style={{ cursor: 'pointer' }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Documents */}
              {newDocuments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3" style={{ color: themeUtils.getTextColor(false) }}>
                    New Documents to Upload ({newDocuments.length})
                  </h4>
                  <div className="space-y-3">
                    {newDocuments.map(doc => (
                      <div
                        key={doc.id}
                        className="p-3 rounded-lg border"
                        style={{
                          borderColor: themeUtils.getBorderColor(),
                          backgroundColor: themeUtils.getBgColor("input"),
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: themeUtils.getBgColor("primary", 0.1) }}>
                              <span className="text-xl">
                                {doc.preview ? <ImageIcon size={20} /> : '📄'}
                              </span>
                            </div>
                            
                            <div className="flex-1">
                              <input
                                type="text"
                                value={doc.description}
                                onChange={e => {
                                  const updated = { ...doc, description: e.target.value };
                                  setNewDocuments(prev => prev.map(d => d.id === doc.id ? updated : d));
                                }}
                                placeholder="Document description"
                                className="w-full px-3 py-1 text-sm rounded-lg border mb-2"
                                style={{
                                  backgroundColor: themeUtils.getBgColor("default"),
                                  borderColor: themeUtils.getBorderColor(),
                                  color: themeUtils.getTextColor(true),
                                }}
                              />
                              
                              <select
                                value={doc.unit_id}
                                onChange={e => {
                                  const updated = { ...doc, unit_id: e.target.value };
                                  setNewDocuments(prev => prev.map(d => d.id === doc.id ? updated : d));
                                }}
                                className="w-full px-3 py-1 text-sm rounded-lg border"
                                style={{
                                  backgroundColor: themeUtils.getBgColor("default"),
                                  borderColor: themeUtils.getBorderColor(),
                                  color: themeUtils.getTextColor(true),
                                }}
                              >
                                <option value="">Select Unit (Optional)</option>
                                {allocations.map((alloc, idx) => (
                                  <option key={alloc.id} value={alloc.unit_id}>
                                    Unit {alloc.unit_number || idx + 1} {alloc.building_name && `- ${alloc.building_name}`}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDocumentDelete(doc)}
                            className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                            title="Remove"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        {doc.preview && (
                          <div className="mt-3">
                            <img
                              src={doc.preview}
                              alt="Preview"
                              className="max-h-32 rounded-lg object-contain"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {documents.length === 0 && newDocuments.length === 0 && (
                <div className="text-center py-8 rounded-lg border" style={{ 
                  borderColor: themeUtils.getBorderColor(),
                  backgroundColor: themeUtils.getBgColor("input")
                }}>
                  <FileText size={40} className="mx-auto mb-2" style={{ color: themeUtils.getTextColor(false, true) }} />
                  <p className="text-sm" style={{ color: themeUtils.getTextColor(false) }}>
                    No documents uploaded. Click "Upload Documents" to add files.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document View Dialog */}
      <CommonDialog
        header="View Document"
        visible={isDocumentViewOpen}
        onHide={() => {
          setIsDocumentViewOpen(false);
          setViewDocument(null);
        }}
        position="center"
        width="50vw"
      >
        {viewDocument && (
          <div className="p-4">
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2" style={{ color: themeUtils.getTextColor(true) }}>
                {viewDocument.description || "Document"}
              </h4>
              {viewDocument.unit_id && (
                <p className="text-sm" style={{ color: themeUtils.getTextColor(false) }}>
                  Unit: {allocations.find(a => a.unit_id === String(viewDocument.unit_id))?.unit_number || viewDocument.unit_id}
                </p>
              )}
              {viewDocument.created_at && (
                <p className="text-xs mt-1" style={{ color: themeUtils.getTextColor(false) }}>
                  Uploaded: {formatDate(viewDocument.created_at)}
                </p>
              )}
            </div>

            {viewDocument.document_url?.match(/\.(jpg|jpeg|png|webp)$/i) ? (
              <img
                src={getDocumentUrl(viewDocument.document_url)}
                alt={viewDocument.description}
                className="w-full rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                <FileText size={64} className="mb-4" style={{ color: themeUtils.getTextColor(false, true) }} />
                <p className="mb-4" style={{ color: themeUtils.getTextColor(true) }}>
                  This document cannot be previewed directly.
                </p>
                <a
                  href={getDocumentUrl(viewDocument.document_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2"
                  style={{
                    backgroundColor: themeUtils.getBgColor("primary"),
                    color: '#fff',
                  }}
                >
                  <Download size={18} />
                  Download to View
                </a>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <Button variant="secondary" onClick={() => setIsDocumentViewOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </CommonDialog>

      {/* Document Edit Dialog */}
      <CommonDialog
        header="Edit Document"
        visible={isDocumentEditOpen}
        onHide={() => {
          setIsDocumentEditOpen(false);
          setEditingDocument(null);
        }}
        position="center"
        width="40vw"
      >
        {editingDocument && (
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                  Description
                </label>
                <input
                  type="text"
                  value={editingDocument.description || ""}
                  onChange={e => setEditingDocument({ ...editingDocument, description: e.target.value })}
                  className="w-full px-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    borderColor: themeUtils.getBorderColor(),
                    color: themeUtils.getTextColor(true),
                  }}
                  placeholder="Enter document description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                  Associated Unit
                </label>
                <select
                  value={editingDocument.unit_id || ""}
                  onChange={e => setEditingDocument({ ...editingDocument, unit_id: e.target.value })}
                  className="w-full px-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  style={{
                    backgroundColor: themeUtils.getBgColor("input"),
                    borderColor: themeUtils.getBorderColor(),
                    color: themeUtils.getTextColor(true),
                  }}
                >
                  <option value="">No Unit (General Document)</option>
                  {allocations.map((alloc, idx) => (
                    <option key={alloc.id} value={alloc.unit_id}>
                      Unit {alloc.unit_number || idx + 1} {alloc.building_name && `- ${alloc.building_name}`}
                    </option>
                  ))}
                </select>
              </div>

              {editingDocument.document_url?.match(/\.(jpg|jpeg|png|webp)$/i) && (
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                    Preview
                  </label>
                  <img
                    src={getDocumentUrl(editingDocument.document_url)}
                    alt="Preview"
                    className="max-h-40 rounded-lg object-contain"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setIsDocumentEditOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleDocumentUpdate(editingDocument)}
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </CommonDialog>

      {/* Footer */}
      <div
        className="flex flex-col sm:flex-row justify-between items-center gap-4 p-5 border-t"
        style={{ borderColor: themeUtils.getBorderColor() }}
      >
        <div className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>
          * Required fields
          {Object.values(errors).some(e => e) && (
            <span className="ml-3 text-red-500">
              Fix {Object.values(errors).filter(Boolean).length} error(s)
            </span>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading || Object.values(errors).some(e => e)}
          >
            {loading ? "Saving..." : "Update Customer"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;