import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Import JSON data to Firestore
 * This utility will upload your JSON data to the companies collection
 */
export const importJSONData = async (jsonData) => {
  try {
    console.log('🚀 Starting data import...', jsonData.length, 'companies');
    
    const results = [];
    
    for (const company of jsonData) {
      try {
        // Create a document ID from the company name (slug format)
        const docId = company.companyName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        
        // Add metadata
        const companyData = {
          ...company,
          slug: docId,
          category: company.category || getRandomCategory(),
          lastUpdated: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          importedAt: new Date().toISOString()
        };
        
        // Use setDoc to create with custom ID
        await setDoc(doc(db, 'companies', docId), companyData);
        
        console.log('✅ Imported:', company.companyName);
        results.push({ success: true, company: company.companyName, id: docId });
        
      } catch (error) {
        console.error('❌ Failed to import:', company.companyName, error);
        results.push({ success: false, company: company.companyName, error: error.message });
      }
    }
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`🎉 Import complete: ${successful} successful, ${failed} failed`);
    
    return {
      success: true,
      total: jsonData.length,
      successful,
      failed,
      results
    };
    
  } catch (error) {
    console.error('💥 Import failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Helper function to assign random categories for demo
 */
const getRandomCategory = () => {
  const categories = ['Residential', 'Commercial', 'Infrastructure'];
  return categories[Math.floor(Math.random() * categories.length)];
};

/**
 * Sample JSON data structure for reference
 */
export const sampleJSONStructure = [
  {
    "companyName": "Samsung C&T",
    "overallScore": 85,
    "e_score": 88,
    "s_score": 90,
    "g_score": 80,
    "sapaViolations": 0
  },
  {
    "companyName": "Hyundai E&C", 
    "overallScore": 78,
    "e_score": 82,
    "s_score": 75,
    "g_score": 79,
    "sapaViolations": 1
  }
];

/**
 * Clear all existing data (use with caution!)
 */
export const clearAllData = async () => {
  console.warn('⚠️ This will delete all company data!');
  // Implementation would go here if needed
  // Note: Firestore doesn't have a native "delete collection" method
  // You'd need to query all documents and delete them individually
};

console.log('📊 Data importer utility loaded');