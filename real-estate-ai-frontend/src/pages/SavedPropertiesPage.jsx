import { useAuth } from '../context/AuthContext'
import { useSavedProperties } from '../context/SavedPropertiesContext'
import { motion } from 'framer-motion'
import { FiHeart, FiMapPin, FiMaximize, FiHome } from 'react-icons/fi'
import { formatPrice, formatArea, formatBHK } from '../utils/helpers'
import toast from 'react-hot-toast'

export const SavedPropertiesPage = () => {
  const { user } = useAuth()
  const { savedProperties, removeSavedProperty } = useSavedProperties()

  const handleRemove = (propertyId) => {
    removeSavedProperty(propertyId)
    toast.success('Removed from saved')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Saved Properties</h1>
          <p className="text-gray-600">
            You have <span className="font-bold">{savedProperties.length}</span> saved properties
          </p>
        </motion.div>

        {savedProperties.length === 0 ? (
          <div className="text-center py-20">
            <FiHeart size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg mb-4">No saved properties yet</p>
            <p className="text-gray-500 mb-6">
              Start exploring and save your favorite properties
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property, idx) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center relative">
                  <FiHome size={48} className="text-white" />
                  <button
                    onClick={() => handleRemove(property.id)}
                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition"
                  >
                    <FiHeart
                      size={20}
                      className="text-red-500 fill-red-500"
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
                    {property.project_name || 'Property'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 flex items-center gap-1">
                    <FiMapPin size={14} />
                    {property.locality}, {property.city}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-4 text-sm text-gray-700">
                    {property.price && (
                      <p className="font-bold text-lg text-blue-600">
                        {formatPrice(property.price)}
                      </p>
                    )}
                    {property.rent_per_month && (
                      <p className="font-bold text-lg text-blue-600">
                        ₹{property.rent_per_month?.toLocaleString()}/month
                      </p>
                    )}
                    {property.bhk && <p>{formatBHK(property.bhk)}</p>}
                    {property.area_sqft && (
                      <p className="flex items-center gap-1">
                        <FiMaximize size={14} />
                        {formatArea(property.area_sqft)}
                      </p>
                    )}
                  </div>

                  {/* Button */}
                  <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-medium">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
