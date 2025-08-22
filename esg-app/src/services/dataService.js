import { db } from './firebase';
import { collection, getDocs, doc, getDoc, query, where, orderBy, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Collection name in Firestore
const COMPANIES_COLLECTION = 'companies';

/**
 * Get all companies from Firestore
 */
export const getAllCompanies = async () => {
  try {
    const q = query(collection(db, COMPANIES_COLLECTION), orderBy('overallScore', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const companies = [];
    querySnapshot.forEach((doc) => {
      companies.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('📊 Fetched companies from Firebase:', companies.length);
    return companies;
  } catch (error) {
    console.error('❌ Error fetching companies:', error);
    // Return mock data as fallback
    return getMockData();
  }
};

/**
 * Get a specific company by ID
 */
export const getCompanyById = async (companyId) => {
  try {
    const docRef = doc(db, COMPANIES_COLLECTION, companyId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log('📊 Fetched company from Firebase:', companyId);
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      console.log('❌ Company not found:', companyId);
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching company:', error);
    // Return mock data as fallback
    const mockData = getMockData();
    return mockData.find(company => company.id === companyId) || null;
  }
};

/**
 * Search companies by name
 */
export const searchCompaniesByName = async (searchTerm) => {
  try {
    // Firestore doesn't support full-text search, so we'll get all companies and filter locally
    // In production, you might want to use Algolia or implement a more sophisticated search
    const companies = await getAllCompanies();
    
    const filteredCompanies = companies.filter(company =>
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    console.log('🔍 Search results for:', searchTerm, filteredCompanies.length);
    return filteredCompanies;
  } catch (error) {
    console.error('❌ Error searching companies:', error);
    return [];
  }
};

/**
 * Filter companies by category (if we add this field later)
 */
export const getCompaniesByCategory = async (category) => {
  try {
    const q = query(
      collection(db, COMPANIES_COLLECTION),
      where('category', '==', category),
      orderBy('overallScore', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const companies = [];
    
    querySnapshot.forEach((doc) => {
      companies.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('📊 Fetched companies by category:', category, companies.length);
    return companies;
  } catch (error) {
    console.error('❌ Error fetching companies by category:', error);
    // Return filtered mock data as fallback
    const mockData = getMockData();
    return mockData.filter(company => company.category === category);
  }
};

/**
 * Add sample data to Firestore (utility function)
 */
export const initializeSampleData = async () => {
  try {
    const sampleData = getMockData();
    
    for (const company of sampleData) {
      const { id, ...companyData } = company;
      await addDoc(collection(db, COMPANIES_COLLECTION), {
        ...companyData,
        category: getRandomCategory(), // Add random category for demo
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
    }
    
    console.log('✅ Sample data initialized in Firebase');
    return true;
  } catch (error) {
    console.error('❌ Error initializing sample data:', error);
    return false;
  }
};

/**
 * Update company data
 */
export const updateCompany = async (companyId, updateData) => {
  try {
    const docRef = doc(db, COMPANIES_COLLECTION, companyId);
    await updateDoc(docRef, {
      ...updateData,
      lastUpdated: new Date().toISOString()
    });
    
    console.log('✅ Company updated:', companyId);
    return true;
  } catch (error) {
    console.error('❌ Error updating company:', error);
    return false;
  }
};

/**
 * Mock data fallback
 */
const getMockData = () => [
  {
    id: 'samsung-ct',
    companyName: "Samsung C&T",
    overallScore: 85,
    e_score: 88,
    s_score: 90,
    g_score: 80,
    sapaViolations: 0,
    slug: "samsung-ct",
    category: "Commercial",
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'hyundai-ec',
    companyName: "Hyundai E&C",
    overallScore: 78,
    e_score: 82,
    s_score: 75,
    g_score: 79,
    sapaViolations: 1,
    slug: "hyundai-ec",
    category: "Infrastructure",
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'daewoo-ec',
    companyName: "Daewoo E&C",
    overallScore: 72,
    e_score: 70,
    s_score: 75,
    g_score: 71,
    sapaViolations: 0,
    slug: "daewoo-ec",
    category: "Residential",
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'gs-ec',
    companyName: "GS E&C",
    overallScore: 69,
    e_score: 65,
    s_score: 72,
    g_score: 70,
    sapaViolations: 2,
    slug: "gs-ec",
    category: "Commercial",
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'lotte-ec',
    companyName: "Lotte E&C",
    overallScore: 65,
    e_score: 60,
    s_score: 68,
    g_score: 67,
    sapaViolations: 1,
    slug: "lotte-ec",
    category: "Residential",
    lastUpdated: new Date().toISOString()
  }
];

/**
 * Helper function to assign random categories
 */
const getRandomCategory = () => {
  const categories = ['Residential', 'Commercial', 'Infrastructure'];
  return categories[Math.floor(Math.random() * categories.length)];
};

/**
 * Get companies with enhanced search and filtering
 */
export const getFilteredCompanies = async (filters = {}) => {
  try {
    let companies = await getAllCompanies();
    
    // Apply search filter
    if (filters.search) {
      companies = companies.filter(company =>
        company.companyName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      companies = companies.filter(company => company.category === filters.category);
    }
    
    // Apply score range filter
    if (filters.minScore) {
      companies = companies.filter(company => company.overallScore >= filters.minScore);
    }
    
    if (filters.maxScore) {
      companies = companies.filter(company => company.overallScore <= filters.maxScore);
    }
    
    // Apply violations filter
    if (filters.hasViolations !== undefined) {
      companies = companies.filter(company => 
        filters.hasViolations ? company.sapaViolations > 0 : company.sapaViolations === 0
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      companies.sort((a, b) => {
        switch (filters.sortBy) {
          case 'score-desc':
            return b.overallScore - a.overallScore;
          case 'score-asc':
            return a.overallScore - b.overallScore;
          case 'name-asc':
            return a.companyName.localeCompare(b.companyName);
          case 'name-desc':
            return b.companyName.localeCompare(a.companyName);
          case 'violations-asc':
            return a.sapaViolations - b.sapaViolations;
          case 'violations-desc':
            return b.sapaViolations - a.sapaViolations;
          default:
            return b.overallScore - a.overallScore;
        }
      });
    }
    
    console.log('🔍 Filtered companies:', companies.length);
    return companies;
  } catch (error) {
    console.error('❌ Error filtering companies:', error);
    return getMockData();
  }
};

console.log('🔥 Data service initialized');