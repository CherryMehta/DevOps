import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { propertyService } from '../services'

const SavedPropertiesContext = createContext()

export const SavedPropertiesProvider = ({ children }) => {
  const [savedProperties, setSavedProperties] = useState([])

  useEffect(() => {
    let isMounted = true

    const loadSavedProperties = async () => {
      const properties = await propertyService.getSavedProperties()
      if (isMounted && Array.isArray(properties)) {
        setSavedProperties(properties)
      }
    }

    loadSavedProperties()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    propertyService.persistSavedProperties(savedProperties)
  }, [savedProperties])

  const addSavedProperty = useCallback((property) => {
    setSavedProperties((prev) => {
      const propertyId = property.id || property.project_name
      if (!prev.find((p) => (p.id || p.project_name) === propertyId)) {
        return [...prev, { ...property, id: propertyId }]
      }
      return prev
    })
  }, [])

  const removeSavedProperty = useCallback((propertyId) => {
    setSavedProperties((prev) =>
      prev.filter((p) => (p.id || p.project_name) !== propertyId)
    )
  }, [])

  const isSaved = useCallback((propertyId) => {
    return savedProperties.some((p) => (p.id || p.project_name) === propertyId)
  }, [savedProperties])

  return (
    <SavedPropertiesContext.Provider
      value={{
        savedProperties,
        addSavedProperty,
        removeSavedProperty,
        isSaved,
      }}
    >
      {children}
    </SavedPropertiesContext.Provider>
  )
}

export const useSavedProperties = () => {
  const context = useContext(SavedPropertiesContext)
  if (!context) {
    throw new Error('useSavedProperties must be used within SavedPropertiesProvider')
  }
  return context
}
