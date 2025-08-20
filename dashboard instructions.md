# Build a Searchable Data Grid Component

## Overview
Create a reusable React component that displays data in a searchable grid/table format with real-time filtering, sorting, and pagination. The component should fetch data from Google Cloud Firestore datatabase and provide an excellent user experience for data exploration.

## Requirements
### Grid/table framework
AG Grid React community edition

### Location
Implement in the existing Dashboard page, where only authenticated users can access the page.
   URL: <host>/dashboard 

### Core Functionality
- **Data Fetching**: Fetch data from Google Cloud Firestore datatabase with proper loading states
- **Search**: Real-time search across all visible columns with debounced input
- **Sorting**: Click column headers to sort ascending/descending with visual indicators
- **Pagination**: Client-side pagination with configurable page sizes (25, 50, 100)

### Columns
- Claim Type
- Status
- Episode ID
- Claim
- Member Number
- Patient
- Sex
- Hospital
- Provider
- Agreement
- Service Date
- Admission Date
- Discharge Date
- Service
- Diagnosis
- Cost
- Benefit
- Payee
- Message ID
- Severity
- Full Text
- Contract Type

### Column to firestore fields mappings
- Claim Type
   - maps to the "claim_type" field in Firestore database 
- Status
   - maps to the "status" field in Firestore database
- Episode ID
   - maps to the "episode_id" field in Firestore database 
- Claim
   - maps to the "claim" field in Firestore database  
- Member Number
   - maps to the "member_no" field in Firestore database  
- Patient
   - maps to the "patient" field in Firestore database  
- Sex
   - maps to the "sex" field in Firestore database  
- Hospital
   - maps to the "hospital" field in Firestore database  
- Provider
  - maps to the "provider" field in Firestore database 
- Agreement
  - maps to the "agreement" field in Firestore database 
- Service Date
  - maps to the "service_date" field in Firestore database 
- Admission Date
  - maps to the "admit_date" field in Firestore database 
- Discharge Date
  - maps to the "disch_date" field in Firestore database 
- Service
   - maps to the "service" field in Firestore database 
- Diagnosis
   - maps to the "diagnosis" field in Firestore database 
- Cost
   - maps to the "cost" field in Firestore database 
- Benefit
   - maps to the "benfit" field in Firestore database 
- Payee
   - maps to the "payee" field in Firestore database  
- Message ID
   - maps to the "message_id" field in Firestore database  
- Severity
   - maps to the "severity" field in Firestore database  
- Full Text
   - maps to the "full_text" field in Firestore database  
- Contract Type 
   - maps to the "contract_type" field in Firestore database  

### Row data formatting
Some of the rows of a column should be displayed in the grid/table in a formatted manner
- The data in the following rows should be prefixed with a '$ ' as they represent dollar amounts
    - 'Cost', 'Benefit' 
- The data in the following rows should be display in the date format of YYYY/MM/DD as they represent dates
    - 'Service Date', 'Admission Date', 'Discharge Date'

### Search Filters
- Claim Number
  - maps to the "claim" field in Firestore database
- Member Number
  - maps to the "member_no" field in Firestore database
- Episode Number 
  - maps to the "episode_id" field in Firestore database
- Hospital
  - maps to the "episode_id" field in Firestore database
  - drop down menu with the options "Calvary", "Gosford", "SJOG" and "St Vincent's"
- Provider
  - maps to the "provider" field in Firestore database
- Claim Status 
  - maps to the "status" field in Firestore database
  - drop down menu with the options "Assessed", "Paid", "Verified", "Received" and "Cancelled"
- Claim Type  
  - maps to the "claim_type" field in Firestore database
  - drop down menu with the options "HOSPITAL"
- Contract Type  
  - maps to the "contract_type" field in Firestore database
  - drop down menu with the options "HOSPITAL"
- Episode ID
  - maps to the "episode_id" field in Firestore database
- Episode Cost 
  - maps to the "cost" field in Firestore database
  - user is able to find a episode cost range by entering a from cost and to cost
- Service Date
  - maps to the "service_date" field in Firestore database
  - user is able to find a Service Date range by selecting a from date and a to date
  - User selects the from date and to date using a calendar date picker

## Search Filter Groups
  Some Search Filters will be visually grouped together under the following headings 'Provider Filters', 'Process Filters' and 'Episode Filters'

  - Provider Filters
    - Hospital
    - Contract Type
    - Provider

  - Process Filters
    - Claim Status
    - Claim Type
    - Service Date 

  - Episode Filters
    - Episode ID
    - Episode Cost


### API Integration
The table/grid gets the data from Google Cloud Firestore datatabase
In the Google Gloud firestore UI I have registered this webapp. The web app's firebase configuration is
const firebaseConfig = {
  apiKey: "AIzaSyAXF9llRtjbA7JudSuDviyx3mMwYv-21bU",
  authDomain: "medi-cliams.firebaseapp.com",
  projectId: "medi-cliams",
  storageBucket: "medi-cliams.firebasestorage.app",
  messagingSenderId: "769142208344",
  appId: "1:769142208344:web:70ad4a37e82ccf91f7172d",
  measurementId: "G-5RWEDR6H35"
};

The collection name is 'medical_claims'
The firebase configuration atrributes and the collection name should be stored in environment variables

The firestore data structure for the document is 
{
   admit_date: "2024-03-13T00:00:00",
   agreement: "QE000120/15.11",
   benefit: 8740,
   claim: 9437374,
   claim_type: "CWO",
   cost: 8740,
   diagnosis: "M-35631 - Operative laparoscopy, including any of",
   disch_date: "2024-03-14T00:00:00",
   episode_id: 103717,
   full_text: "DRG with length of stay <2 days",
   hospital: "Calvary",
   member_no: 323788,
   message_id: "AC5004",
   patient: "Jennifer Collins",
   payee: "P",
   provider: "0055600D",
   service: "X-N05A",
   service_date: "2024-03-13T00:00:00",
   severity: "O"
   sex: "M",
   status "Verified"
}

  
- **Endpoint**: Loading data from the firebase end point with query parameters for search, sort, pagination
- **Error Handling**: Display user-friendly error messages for API failures
- **Loading States**: Show skeleton loaders or spinners during data fetch
- **Server Pagination**: In addtional to Client-side pagination with configurable page sizes (25, 50, 100), a maximum of 200 records can be fetched at a time from the backend



### UI/UX Features
- Use a modern design that is aligned to the style of the rest of the web application (for more details about the design of the web application refer to  the 'Design & Styling section' in 'instruction.md')
- **Responsive Design**: Mobile-first approach, works on all screen sizes
- **Empty States**: Show meaningful messages when no data or no search results
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Export**: Export filtered/searched data to CSV/Excel