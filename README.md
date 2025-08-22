# junction2025
ESG analysis app for construction companies in South Korea

ESG Analysis Website - Technical Specification

  Project Overview

  Platform: ESG scoring dashboard for South Korean construction
  companiesUsers: Individual & institutional investorsTech Stack:
  React + Firebase + Gemini AI

  ---
  1. Application Architecture

  Frontend Structure (React)

  src/
  ├── components/
  │   ├── common/           # Shared UI components
  │   ├── leaderboard/      # Main page components
  │   ├── search/           # Company search components
  │   └── company/          # Company details components
  ├── pages/
  │   ├── LeaderboardPage.jsx    # Main page
  │   ├── SearchPage.jsx         # Search companies
  │   └── CompanyDetailsPage.jsx # Individual company view
  ├── services/
  │   ├── firebase.js       # Firebase configuration
  │   ├── dataService.js    # Data retrieval functions
  │   └── aiService.js      # Gemini AI integration
  ├── utils/
  │   ├── scoring.js        # ESG score utilities
  │   └── formatters.js     # Data formatting helpers
  └── hooks/                # Custom React hooks

  Firebase Database Structure

  companies: {
    "samsung-ct": {
      "companyName": "Samsung C&T",
      "overallScore": 85,
      "e_score": 88,
      "s_score": 90,
      "g_score": 80,
      "sapaViolations": 0,
      "slug": "samsung-ct",
      "lastUpdated": "timestamp"
    }
  }

  ---
  2. Page Specifications

  # Main Page (Leaderboard)

  Purpose: Show top-performing companies by ESG score

  Features:
  - Ranking table: Company name, overall score, trend indicators
  - Filter options: Top 10/25/50, score ranges
  - Visual elements: Score badges, ranking positions
  - Quick actions: Click to view details

  # Search Page

  Purpose: Find companies by category or name

  Features:
  - Search bar: Company name autocomplete
  - Category filters: Construction type (residential, commercial,
  infrastructure)
  - Results grid: Company cards with key metrics
  - Sort options: Score, name, violations

  # Company Details Page

  Purpose: Comprehensive ESG analysis for individual companies

  Features:
  - Header: Company name, overall score (prominent)
  - ESG Breakdown: Visual representation of E/S/G individual
  scores
  - SAPA Violations: Badge/indicator if violations > 0
  - AI Analysis Section:
    - "Why this score?" explanation
    - Peer comparison insights
    - Investment recommendations

  ---
  3. UI/UX Design Priorities

  ESG Score Visualization

  - Overall Score: Large, prominent number with color coding (red
  <60, yellow 60-80, green >80)
  - Individual Scores: Progress bars or circular charts for E/S/G
  - Comparison Context: Industry average indicators

  Investor-Focused Design

  - Key Metrics First: Scores and violations prominently displayed
  - Professional Aesthetics: Clean, data-focused interface
  - Mobile Responsive: Tablet/mobile compatibility for on-the-go
  analysis

  ---
  4. Gemini AI Integration Strategy

  Analysis Types

  1. Score Explanation: "Why does [Company] have this ESG score?"
  2. Peer Comparison: "How does [Company] compare to industry
  leaders?"
  3. Investment Guidance: "Should investors consider [Company]
  based on ESG metrics?"

  Implementation Approach

  - Pre-computed responses: Generate AI analysis when data is
  uploaded
  - Structured prompts: Consistent analysis format across
  companies
  - Caching strategy: Store AI responses in Firebase to avoid
  repeated API calls

  ---
  5. Development Phases

  Phase 1: Core Functionality

  - Set up React app with routing
  - Implement basic Firebase connection
  - Create leaderboard with sample data

  Phase 2: Search & Details

  - Build search functionality
  - Design company details page
  - Implement ESG score visualization

  Phase 3: AI Integration

  - Connect Gemini AI API
  - Generate analysis responses
  - Add AI analysis to company pages

  Phase 4: Polish & Optimization

  - Responsive design refinements
  - Performance optimization
  - User experience improvements

  ---