import React, { useState, useEffect } from "react";
import { Upload, X, Plus } from "lucide-react";
import Button from "../../../ui/common/Button.jsx";
import { useTheme } from "../../../ui/Settings/themeUtils";
import { useToast } from "../../../ui/common/CostumeTost";
import { useNavigate } from "react-router-dom";

const API_BASE = `${import.meta.env.VITE_API_CUSTOMER_URL}/api`;


const AddCustomer = ({ onClose, onSuccess }) => {
  const { themeUtils } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    gender: "",
    email: "",
    contact_number: "",
    country: "",
    city: "",
    address_line1: "",
    address_line2: "",
    joining_date: new Date().toISOString().split("T")[0],
    profile_image: null,
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ─── Allocation blocks ───────────────────────────────────────
  const createEmptyAllocation = () => ({
    id: Date.now(),
    community_id: "",
    property_id: "",
    unit_id: "",
    documents: [{ id: 1, name: "", file: null, preview: null }],
  });

  const [allocations, setAllocations] = useState([createEmptyAllocation()]);

  // Cascading dropdown data (per allocation)
  const [communities, setCommunities] = useState([]);
  const [propertiesByCommunity, setPropertiesByCommunity] = useState({});
  const [unitsByProperty, setUnitsByProperty] = useState({});

  // Country & city dropdowns (using location master)
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState("");

  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

  // Fetch Countries from location master
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const res = await fetch(`${API_BASE}/location/countries`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        // Handle response format (array or { data })
        const countriesArray = Array.isArray(data) ? data : data.data || [];
        setCountries(countriesArray);
      } catch (err) {
        console.error("Countries fetch failed:", err);
        toast.error("Error", "Failed to load countries");
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch Cities when country changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountryId) {
        setCities([]);
        return;
      }

      try {
        setLoadingCities(true);
        const res = await fetch(`${API_BASE}/location/cities/${selectedCountryId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        // Handle response format
        const citiesArray = Array.isArray(data) ? data : data.data || [];
        setCities(citiesArray);
      } catch (err) {
        console.error("Cities fetch failed:", err);
        toast.error("Error", "Failed to load cities");
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [selectedCountryId]);

  // Fetch Communities
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoadingCommunities(true);
        const res = await fetch(`${API_BASE}/communities`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const communitiesArray = Array.isArray(data) ? data : data.data || [];
        setCommunities(communitiesArray);
      } catch (err) {
        console.error("Communities fetch failed:", err);
        toast.error("Error", "Failed to load communities");
      } finally {
        setLoadingCommunities(false);
      }
    };
    fetchCommunities();
  }, []);

  // Fetch properties when community changes
  useEffect(() => {
    const fetchMissingProperties = async () => {
      for (const alloc of allocations) {
        const cid = alloc.community_id;
        if (!cid || propertiesByCommunity[cid]) continue;

        try {
          const res = await fetch(`${API_BASE}/properties/by-community/${cid}`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          
          const props = (Array.isArray(json) ? json : json.data || []).map(p => ({
            ...p,
            property_id: Number(p.property_id) || Number(p.building_id)
          }));
          
          setPropertiesByCommunity(prev => ({ ...prev, [cid]: props }));
        } catch (err) {
          console.error("Properties fetch failed:", err);
          toast.error("Error", "Failed to load properties");
        }
      }
    };
    fetchMissingProperties();
  }, [allocations.map(a => a.community_id).join(",")]);

  // Fetch units when property changes
  useEffect(() => {
    const fetchMissingUnits = async () => {
      for (const alloc of allocations) {
        const pid = alloc.property_id;
        if (!pid || unitsByProperty[pid]) continue;

        try {
          const res = await fetch(`${API_BASE}/units/by-property/${pid}`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          
          const unitsArr = (Array.isArray(json) ? json : json.data || []).map(u => ({
            ...u,
            unit_id: Number(u.unit_id)
          }));
          
          setUnitsByProperty(prev => ({ ...prev, [pid]: unitsArr }));
        } catch (err) {
          console.error("Units fetch failed:", err);
          toast.error("Error", "Failed to load units");
        }
      }
    };
    fetchMissingUnits();
  }, [allocations.map(a => a.property_id).join(",")]);

  // ─── Validation ──────────────────────────────────────────────
  const validateField = (name, value) => {
    switch (name) {
      case "full_name":
        if (!value.trim()) return "Full name is required";
        if (value.length < 2) return "Min 2 characters";
        if (value.length > 100) return "Max 100 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email";
        return "";
      case "contact_number":
        if (!value.trim()) return "Contact number is required";
        if (!/^\+?\d{7,15}$/.test(value.replace(/\s/g, ""))) return "Invalid phone (7-15 digits)";
        return "";
      case "address_line1":
        if (!value.trim()) return "Address line 1 is required";
        if (value.length > 200) return "Max 200 characters";
        return "";
      case "country":
        if (!value) return "Country is required";
        return "";
      default:
        return "";
    }
  };

  const validateAllocation = (alloc) => {
    if (!alloc.community_id) return "Community is required";
    return "";
  };

  const validateForm = () => {
    const newErrors = {};

    ["full_name", "email", "contact_number", "address_line1", "country"].forEach(field => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });

    let hasValidAllocation = false;

    allocations.forEach((alloc, index) => {
      const allocError = validateAllocation(alloc);
      if (allocError) {
        newErrors[`allocation_${index}_community`] = allocError;
      }
      if (alloc.community_id) {
        hasValidAllocation = true;
      }
    });

    if (!hasValidAllocation) {
      newErrors.global = "At least one valid allocation (with community) is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Special handling for country change
    if (name === "country") {
      const selectedCountry = countries.find(c => c.country_id === parseInt(value));
      if (selectedCountry) {
        setSelectedCountryId(value);
        // Clear city when country changes
        setFormData(prev => ({ ...prev, city: "" }));
      }
    }
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid File Type", "Please select JPEG, PNG or WEBP");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File Too Large", "Image should be less than 5MB");
      return;
    }
    
    setFormData(prev => ({ ...prev, profile_image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, profile_image: null }));
    setPreviewImage(null);
    const input = document.getElementById("customer-image");
    if (input) input.value = "";
  };

  // ─── Allocation handlers ─────────────────────────────────────
  const updateAllocation = (allocId, field, value) => {
    setAllocations(prev =>
      prev.map(alloc =>
        alloc.id === allocId ? { ...alloc, [field]: value } : alloc
      )
    );

    if (field === "community_id") {
      setAllocations(prev =>
        prev.map(alloc =>
          alloc.id === allocId
            ? { ...alloc, property_id: "", unit_id: "" }
            : alloc
        )
      );
    }
    if (field === "property_id") {
      setAllocations(prev =>
        prev.map(alloc =>
          alloc.id === allocId ? { ...alloc, unit_id: "" } : alloc
        )
      );
    }
  };

  const addAllocation = () => {
    setAllocations(prev => [...prev, createEmptyAllocation()]);
  };

  const removeAllocation = (allocId) => {
    if (allocations.length === 1) {
      toast.info("Info", "At least one allocation is required");
      return;
    }
    setAllocations(prev => prev.filter(a => a.id !== allocId));
  };

  // ─── Document handlers ──────────────────────
  const handleDocNameChange = (allocId, docId, value) => {
    setAllocations(prev =>
      prev.map(alloc =>
        alloc.id === allocId
          ? {
              ...alloc,
              documents: alloc.documents.map(doc =>
                doc.id === docId ? { ...doc, name: value } : doc
              )
            }
          : alloc
      )
    );
  };

  const handleDocFileChange = (allocId, docId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid File", "JPG, PNG, WEBP or PDF only");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File Too Large", "Max 5MB");
      return;
    }

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAllocations(prev =>
          prev.map(alloc =>
            alloc.id === allocId
              ? {
                  ...alloc,
                  documents: alloc.documents.map(doc =>
                    doc.id === docId ? { ...doc, preview: reader.result, file } : doc
                  )
                }
              : alloc
          )
        );
      };
      reader.readAsDataURL(file);
    } else {
      setAllocations(prev =>
        prev.map(alloc =>
          alloc.id === allocId
            ? {
                ...alloc,
                documents: alloc.documents.map(doc =>
                  doc.id === docId ? { ...doc, file, preview: null } : doc
                )
              }
            : alloc
        )
      );
    }
  };

  const addDocumentRow = (allocId) => {
    setAllocations(prev =>
      prev.map(alloc =>
        alloc.id === allocId
          ? {
              ...alloc,
              documents: [
                ...alloc.documents,
                { id: Date.now(), name: "", file: null, preview: null }
              ]
            }
          : alloc
      )
    );
  };

  const removeDocumentRow = (allocId, docId) => {
    setAllocations(prev =>
      prev.map(alloc =>
        alloc.id === allocId
          ? {
              ...alloc,
              documents:
                alloc.documents.length === 1
                  ? [{ id: Date.now(), name: "", file: null, preview: null }]
                  : alloc.documents.filter(d => d.id !== docId)
            }
          : alloc
      )
    );
  };

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Validation Error", "Please fix the errors in the form.");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Personal & address info
      formDataToSend.append("full_name", formData.full_name.trim());
      formDataToSend.append("gender", formData.gender || "");
      formDataToSend.append("email", formData.email.trim());
      formDataToSend.append("contact_number", formData.contact_number.trim());
      formDataToSend.append("country", formData.country || "");
      formDataToSend.append("city", formData.city || "");
      formDataToSend.append("address_line1", formData.address_line1.trim());
      formDataToSend.append("address_line2", formData.address_line2?.trim() || "");
      formDataToSend.append("joining_date", formData.joining_date);

      if (formData.profile_image) {
        formDataToSend.append("profile_picture", formData.profile_image);
      }

      // Allocations + documents
      let validAllocCount = 0;

      allocations.forEach((alloc, allocIndex) => {
        if (!alloc.community_id) return;

        validAllocCount++;

        formDataToSend.append(`community_id_${allocIndex}`, alloc.community_id);
        formDataToSend.append(`property_id_${allocIndex}`, alloc.property_id || "");
        formDataToSend.append(`unit_id_${allocIndex}`, alloc.unit_id || "");

        alloc.documents.forEach((doc, docIndex) => {
          if (doc.file) {
            formDataToSend.append(`document_${allocIndex}_${docIndex}`, doc.file);
            formDataToSend.append(`description_${allocIndex}_${docIndex}`, doc.name?.trim() || "");
          }
        });
      });

      if (validAllocCount === 0) {
        throw new Error("At least one valid allocation is required");
      }

      const res = await fetch(`${API_BASE}/customers`, {
        method: "POST",
        body: formDataToSend,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to create customer");
      }

      toast.success("Success", "Customer added successfully!");
      onSuccess?.(json.data);
      onClose?.();
      navigate("/customerlist");
    } catch (err) {
      console.error("Customer creation failed:", err);
      toast.error("Error", err.message || "Failed to add customer");
    } finally {
      setLoading(false);
    }
  };

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <div
      className="flex flex-col h-full rounded-lg"
      style={{ backgroundColor: themeUtils.getBgColor("default") }}
    >
      <div
        className="flex-1 overflow-y-auto p-4 lg:p-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture */}
          <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
            <div
              className="w-full max-w-xs p-5 rounded-lg border"
              style={{
                backgroundColor: themeUtils.getBgColor("input"),
                borderColor: themeUtils.getBorderColor(),
              }}
            >
              <h3
                className="text-sm font-medium mb-4 text-center lg:text-left"
                style={{ color: themeUtils.getTextColor(true) }}
              >
                Profile Picture
              </h3>
              {previewImage ? (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                    type="button"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  style={{ borderColor: themeUtils.getBorderColor() }}
                  onClick={() => document.getElementById("customer-image")?.click()}
                >
                  <Upload
                    size={32}
                    className="mx-auto mb-3"
                    style={{ color: themeUtils.getTextColor(false, true) }}
                  />
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
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-2 space-y-10">
            {/* Personal Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: themeUtils.getTextColor(true) }}>
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-1">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-medium" style={{ color: themeUtils.getTextColor(false) }}>
                      Full Name *
                    </label>
                    <span className="text-xs" style={{ color: themeUtils.getTextColor(false, true) }}>
                      {formData.full_name.length}/100
                    </span>
                  </div>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    maxLength={100}
                    className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                      errors.full_name ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      borderColor: errors.full_name ? "#ef4444" : themeUtils.getBorderColor(),
                      color: themeUtils.getTextColor(true),
                    }}
                    placeholder="Enter full name"
                  />
                  {errors.full_name && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.full_name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                      errors.gender ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      borderColor: errors.gender ? "#ef4444" : themeUtils.getBorderColor(),
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      borderColor: errors.email ? "#ef4444" : themeUtils.getBorderColor(),
                      color: themeUtils.getTextColor(true),
                    }}
                    placeholder="customer@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 15);
                      handleChange({ target: { name: "contact_number", value: val } });
                    }}
                    maxLength={15}
                    className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                      errors.contact_number ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      borderColor: errors.contact_number ? "#ef4444" : themeUtils.getBorderColor(),
                      color: themeUtils.getTextColor(true),
                    }}
                    placeholder="+971501234567"
                  />
                  {errors.contact_number && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.contact_number}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Details - Using Location Master */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: themeUtils.getTextColor(true) }}>
                Address Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled={loadingCountries}
                    className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 ${
                      errors.country ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      borderColor: errors.country ? "#ef4444" : themeUtils.getBorderColor(),
                      color: themeUtils.getTextColor(true),
                    }}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.country_id} value={country.country_id}>
                        {country.country_name}
                      </option>
                    ))}
                  </select>
                  {loadingCountries && <p className="text-xs mt-1 text-gray-500">Loading countries...</p>}
                  {errors.country && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.country}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                    City
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!selectedCountryId || loadingCities}
                    className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      borderColor: errors.city ? "#ef4444" : themeUtils.getBorderColor(),
                      color: themeUtils.getTextColor(true),
                    }}
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.city_id} value={city.city_id}>
                        {city.city_name}
                      </option>
                    ))}
                  </select>
                  {loadingCities && <p className="text-xs mt-1 text-gray-500">Loading cities...</p>}
                </div>

                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-medium" style={{ color: themeUtils.getTextColor(false) }}>
                      Address Line 1 *
                    </label>
                    <span className="text-xs" style={{ color: themeUtils.getTextColor(false, true) }}>
                      {formData.address_line1.length}/200
                    </span>
                  </div>
                  <input
                    type="text"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleChange}
                    maxLength={200}
                    className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                      errors.address_line1 ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      borderColor: errors.address_line1 ? "#ef4444" : themeUtils.getBorderColor(),
                      color: themeUtils.getTextColor(true),
                    }}
                    placeholder="Street address, P.O. box..."
                  />
                  {errors.address_line1 && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.address_line1}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleChange}
                    className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                      errors.address_line2 ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor: themeUtils.getBgColor("input"),
                      borderColor: errors.address_line2 ? "#ef4444" : themeUtils.getBorderColor(),
                      color: themeUtils.getTextColor(true),
                    }}
                    placeholder="Apartment, suite, floor..."
                  />
                </div>
              </div>
            </div>

            {/* Multiple Allocations */}
            <div className="space-y-10">
              {allocations.map((alloc, allocIndex) => (
                <div
                  key={alloc.id}
                  className="border rounded-lg p-3"
                  style={{ borderColor: themeUtils.getBorderColor() }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold" style={{ color: themeUtils.getTextColor(true) }}>
                      Allocation {allocIndex + 1}
                    </h3>
                    {allocations.length > 1 && (
                      <button
                        onClick={() => removeAllocation(alloc.id)}
                        className="text-red-500 hover:text-red-700"
                        type="button"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                        Community *
                      </label>
                      <select
                        value={alloc.community_id}
                        onChange={(e) => updateAllocation(alloc.id, "community_id", e.target.value)}
                        disabled={loadingCommunities}
                        className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 ${
                          errors[`allocation_${allocIndex}_community`] ? "border-red-500" : "border-gray-300"
                        }`}
                        style={{
                          backgroundColor: themeUtils.getBgColor("input"),
                          borderColor: errors[`allocation_${allocIndex}_community`] ? "#ef4444" : themeUtils.getBorderColor(),
                          color: themeUtils.getTextColor(true),
                        }}
                      >
                        <option value="">Select Community</option>
                        {communities.map((comm) => (
                          <option key={comm.community_id} value={comm.community_id}>
                            {comm.community_name}
                          </option>
                        ))}
                      </select>
                      {loadingCommunities && <p className="text-xs mt-1 text-gray-500">Loading...</p>}
                      {errors[`allocation_${allocIndex}_community`] && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <span>⚠</span> {errors[`allocation_${allocIndex}_community`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                        Property
                      </label>
                      <select
                        value={alloc.property_id}
                        onChange={(e) => updateAllocation(alloc.id, "property_id", e.target.value)}
                        disabled={!alloc.community_id}
                        className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 ${
                          errors[`allocation_${allocIndex}_property`] ? "border-red-500" : "border-gray-300"
                        }`}
                        style={{
                          backgroundColor: themeUtils.getBgColor("input"),
                          borderColor: errors[`allocation_${allocIndex}_property`] ? "#ef4444" : themeUtils.getBorderColor(),
                          color: themeUtils.getTextColor(true),
                        }}
                      >
                        <option value="">Select Property</option>
                        {(propertiesByCommunity[alloc.community_id] || []).map((prop) => (
                          <option key={prop.property_id} value={prop.property_id}>
                            {prop.property_name || prop.building_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                        Unit
                      </label>
                      <select
                        value={alloc.unit_id}
                        onChange={(e) => updateAllocation(alloc.id, "unit_id", e.target.value)}
                        disabled={!alloc.property_id}
                        className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 ${
                          errors[`allocation_${allocIndex}_unit`] ? "border-red-500" : "border-gray-300"
                        }`}
                        style={{
                          backgroundColor: themeUtils.getBgColor("input"),
                          borderColor: errors[`allocation_${allocIndex}_unit`] ? "#ef4444" : themeUtils.getBorderColor(),
                          color: themeUtils.getTextColor(true),
                        }}
                      >
                        <option value="">Select Unit</option>
                        {(unitsByProperty[alloc.property_id] || []).map((unit) => (
                          <option key={unit.unit_id} value={unit.unit_id}>
                            {unit.unit_number}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                        Joining Date
                      </label>
                      <input
                        type="date"
                        name="joining_date"
                        value={formData.joining_date}
                        onChange={handleChange}
                        className={`w-full px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                          errors.joining_date ? "border-red-500" : "border-gray-300"
                        }`}
                        style={{
                          backgroundColor: themeUtils.getBgColor("input"),
                          borderColor: errors.joining_date ? "#ef4444" : themeUtils.getBorderColor(),
                          color: themeUtils.getTextColor(true),
                        }}
                      />
                    </div>
                  </div>

                  {/* Documents per allocation */}
                  <div>
                    <h4 className="text-base font-medium mb-3" style={{ color: themeUtils.getTextColor(true) }}>
                      Documents for this allocation
                    </h4>
                    <div className="space-y-2">
                      {alloc.documents.map((doc) => (
                        <div key={doc.id} className="flex flex-col sm:flex-row gap-4 items-end">
                          <div className="flex-1">
                            <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                              Document Name / Description
                            </label>
                            <input
                              type="text"
                              value={doc.name}
                              onChange={(e) => handleDocNameChange(alloc.id, doc.id, e.target.value)}
                              placeholder="e.g. Emirates ID Front, Tenancy Contract..."
                              className="w-full px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border-gray-300"
                              style={{
                                backgroundColor: themeUtils.getBgColor("input"),
                                borderColor: themeUtils.getBorderColor(),
                                color: themeUtils.getTextColor(true),
                              }}
                            />
                          </div>

                          <div className="flex-1 w-full sm:w-auto">
                            <label className="block text-sm font-medium mb-1.5" style={{ color: themeUtils.getTextColor(false) }}>
                              Upload File
                            </label>
                            <div
                              className="border-2 border-dashed rounded-lg p-2 text-center cursor-pointer hover:border-blue-500 transition-colors relative min-h-[37px] flex items-center justify-center"
                              style={{ borderColor: themeUtils.getBorderColor() }}
                              onClick={() => document.getElementById(`doc-upload-${alloc.id}-${doc.id}`)?.click()}
                            >
                              {doc.preview ? (
                                <div className="relative w-full h-full">
                                  <img
                                    src={doc.preview}
                                    alt="Preview"
                                    className="max-h-[90px] mx-auto object-contain rounded"
                                  />
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAllocations(prev =>
                                        prev.map(a =>
                                          a.id === alloc.id
                                            ? {
                                                ...a,
                                                documents: a.documents.map(d =>
                                                  d.id === doc.id ? { ...d, file: null, preview: null } : d
                                                )
                                              }
                                            : a
                                        )
                                      );
                                      const input = document.getElementById(`doc-upload-${alloc.id}-${doc.id}`);
                                      if (input) input.value = "";
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                    type="button"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : doc.file ? (
                                <div className="text-sm text-gray-600 flex items-center gap-2">
                                  <span>📄 {doc.file.name}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAllocations(prev =>
                                        prev.map(a =>
                                          a.id === alloc.id
                                            ? {
                                                ...a,
                                                documents: a.documents.map(d =>
                                                  d.id === doc.id ? { ...d, file: null, preview: null } : d
                                                )
                                              }
                                            : a
                                        )
                                      );
                                      const input = document.getElementById(`doc-upload-${alloc.id}-${doc.id}`);
                                      if (input) input.value = "";
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                    type="button"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <Upload size={18} className="mx-auto" style={{ color: themeUtils.getTextColor(false, true) }} />
                                  <p className="text-sm" style={{ color: themeUtils.getTextColor(true) }}>
                                    Click to upload
                                  </p>
                                </>
                              )}
                            </div>
                            <input
                              id={`doc-upload-${alloc.id}-${doc.id}`}
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                              className="hidden"
                              onChange={(e) => handleDocFileChange(alloc.id, doc.id, e)}
                            />
                          </div>

                          <button
                            onClick={() => removeDocumentRow(alloc.id, doc.id)}
                            className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
                            type="button"
                            title="Remove this document"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => addDocumentRow(alloc.id)}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                        type="button"
                      >
                        + Add Document
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addAllocation}
                className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                type="button"
              >
                <Plus size={18} /> Add New Allocation
              </button>

              {errors.global && (
                <p className="mt-4 text-sm text-red-500 flex items-center gap-1">
                  <span>⚠</span> {errors.global}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex flex-col sm:flex-row justify-between items-center gap-4 p-5 border-t mt-auto"
        style={{ borderColor: themeUtils.getBorderColor() }}
      >
        <div className="text-sm" style={{ color: themeUtils.getTextColor(false, true) }}>
          * Required fields
          {hasErrors && (
            <span className="ml-3 text-red-500">
              Please fix {Object.values(errors).filter(Boolean).length} error(s)
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
            disabled={loading || hasErrors}
          >
            {loading ? "Saving..." : "Add Customer"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;