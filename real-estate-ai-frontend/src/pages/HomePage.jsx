import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiMapPin, FiDollarSign, FiHome } from 'react-icons/fi'

export const HomePage = () => {
  const [searchData, setSearchData] = useState({
    city: '',
    budget: '',
    bhk: '',
    type: 'buy',
  })
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchData)
    navigate(`/${searchData.type}?${params.toString()}`)
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Find Your Perfect Property with AI
          </h1>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Discover homes that match your lifestyle. Powered by advanced AI technology.
          </p>

          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-5 gap-4"
          >
            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3">
                <FiMapPin className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Indore, Mumbai..."
                  value={searchData.city}
                  onChange={(e) => setSearchData({ ...searchData, city: e.target.value })}
                  className="w-full px-2 py-2 outline-none"
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3">
                <FiDollarSign className="text-gray-500" />
                <input
                  type="text"
                  placeholder="₹ Amount"
                  value={searchData.budget}
                  onChange={(e) => setSearchData({ ...searchData, budget: e.target.value })}
                  className="w-full px-2 py-2 outline-none"
                />
              </div>
            </div>

            {/* BHK */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">BHK</label>
              <select
                value={searchData.bhk}
                onChange={(e) => setSearchData({ ...searchData, bhk: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
              >
                <option value="">Any</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <div className="flex gap-2">
                {['buy', 'rent'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSearchData({ ...searchData, type })}
                    className={`flex-1 py-2 rounded-lg font-medium transition ${
                      searchData.type === type
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {type === 'buy' ? 'Buy' : 'Rent'}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-medium flex items-center justify-center gap-2"
              >
                <FiSearch size={18} />
                Search
              </button>
            </div>
          </motion.form>
        </motion.div>
      </section>

      {/* Featured Properties */}
      <FeaturedPropertiesSection />
    </div>
  )
}

const FeaturedPropertiesSection = () => {
  const navigate = useNavigate()

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
          <p className="text-gray-600 text-lg">Explore our handpicked selection of premium properties</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: item * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <FiHome size={64} className="text-white" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">Property {item}</h3>
                  <span className="text-blue-500 font-bold">Loading...</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Data from API</p>
                <button
                  onClick={() => navigate('/buy')}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/buy')}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
          >
            Explore All Properties →
          </motion.button>
        </div>
      </div>
    </section>
  )
}
