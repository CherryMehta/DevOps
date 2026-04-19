import { useState, useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { propertyService } from '../services'
import { useSavedProperties } from '../context/SavedPropertiesContext'
import { formatPrice, formatArea, formatBHK } from '../utils/helpers'
import toast from 'react-hot-toast'
import { FiHeart, FiMapPin, FiMaximize, FiHome } from 'react-icons/fi'

export const PropertyListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const type = location.pathname === '/rent' ? 'rent' : 'buy'
  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    budget: searchParams.get('budget') || '',
    bhk: searchParams.get('bhk') || '',
  })
  const [page, setPage] = useState(1)
  const { addSavedProperty, removeSavedProperty, isSaved } = useSavedProperties()

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true)
      try {
        const nextFilters = {
          ...filters,
          page,
        }
        const cleanedFilters = Object.fromEntries(
          Object.entries(nextFilters).filter(([, value]) => value !== '' && value != null)
        )
        setSearchParams(
          cleanedFilters
        )
        const data =
          type === 'buy'
            ? await propertyService.getBuyProperties(cleanedFilters)
            : await propertyService.getRentProperties(cleanedFilters)
        setProperties(data.properties || [])
      } catch (error) {
        toast.error('Failed to fetch properties')
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperties()
  }, [filters, page, type])

  const handleSaveProperty = (property) => {
    if (isSaved(property.id)) {
      removeSavedProperty(property.id)
      propertyService.removeSavedProperty(property.id)
      toast.success('Removed from saved')
    } else {
      addSavedProperty(property)
      propertyService.saveProperty(property.id)
      toast.success('Added to saved')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-6">Filters</h3>

              {/* City */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => {
                    setFilters({ ...filters, city: e.target.value })
                    setPage(1)
                  }}
                  placeholder="Enter city"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              {/* Budget Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Budget
                </label>
                <input
                  type="number"
                  value={filters.budget}
                  onChange={(e) => {
                    setFilters({ ...filters, budget: e.target.value })
                    setPage(1)
                  }}
                  placeholder="₹ Amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              {/* BHK */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">BHK</label>
                <select
                  value={filters.bhk}
                  onChange={(e) => {
                    setFilters({ ...filters, bhk: e.target.value })
                    setPage(1)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Any</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setFilters({ city: '', budget: '', bhk: '' })
                  setPage(1)
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>

          {/* Properties Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="md:col-span-3"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
              Properties for {type}
            </h2>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl h-96 animate-pulse" />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <FiHome size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No properties found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {properties.map((property, idx) => (
                  <motion.div
                    key={property.id || property.project_name || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer group"
                  >
                    {/* Image */}
                    <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center relative overflow-hidden">
                      <FiHome size={48} className="text-white" />
                      <button
                        onClick={() =>
                          handleSaveProperty({
                            ...property,
                            id: property.id || property.project_name || `${property.city}-${idx}`,
                          })
                        }
                        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition"
                      >
                        <FiHeart
                          size={20}
                          className={isSaved(property.id || property.project_name || `${property.city}-${idx}`) ? 'text-red-500 fill-red-500' : 'text-gray-400'}
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
                        {type === 'buy' ? (
                          <p className="font-bold text-lg text-blue-600">
                            {formatPrice(property.price)}
                          </p>
                        ) : (
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

            {/* Pagination */}
            {!isLoading && properties.length > 0 && (
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                  Page {page}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
