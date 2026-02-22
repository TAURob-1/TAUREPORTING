# Document Upload & Brief Analysis Feature

## Overview
Added document upload capability to the ChatTab with pre-loaded prompt templates for brief analysis. Ready for live demo on Feb 23.

## Features Implemented

### 1. Document Upload Button (📎)
- Located next to the "Send" button in the chat interface
- Accepts `.pdf`, `.txt`, `.docx` files (DOCX shows "coming soon" message)
- 10MB file size limit
- Client-side PDF parsing using `pdfjs-dist`
- Shows visual badge when document is attached

### 2. Quick Action Templates
Three pre-defined prompt buttons above chat input:

- **📋 Analyze Brief** - Full brief analysis with improvement suggestions and paid media plan
- **📊 Media Plan Only** - Focuses on detailed paid media recommendations
- **🎯 Competitive Analysis** - Uses Signal data for competitive positioning

### 3. Visual Polish

**Document Upload Badge:**
```
📄 Document attached: [filename]
[word count] words • [file size] KB
[Remove button]
```

**Loading States:**
- Processing document: "📄 Processing document..."
- Analyzing brief: "🤔 Analyzing brief... (this may take 30-60 seconds)"
- Success: "✅ Brief analyzed - [X] words processed"

**Error Messages:**
- File too large: "File too large, please use a smaller document (max 10MB)"
- Unsupported format: "Please upload PDF, DOCX, or TXT files"
- Parse failure: "Could not extract text from document, please try a different file"

### 4. Brief Analysis Prompt Template

When "Analyze Brief" is clicked with a document:
```
Here is our brief for [Advertiser Name] [Campaign Name]. Please analyze:

1) What do you think of the brief and how can it be improved?
2) What would you recommend as a plan? Paid media only.

[Full document content inserted here]
```

## Technical Implementation

### Client-Side PDF Parsing
- Uses `pdfjs-dist` library for in-browser PDF text extraction
- CDN-hosted worker for better Vite compatibility
- Handles multi-page PDFs
- Truncates content at 50,000 characters to stay within token limits

### Service Layer Updates
- Modified `sendPlannerMessage` to accept `documentContent` parameter
- Document content is included in the message sent to the AI
- Context envelope includes all existing platform data plus document text

## Testing the Feature

### Pre-Demo Checklist
1. ✅ Install dependencies: `npm install pdfjs-dist`
2. ✅ Build passes: `npm run build`
3. ✅ Test PDF exists: `~/Signal/companies/tombola-co-uk/arcade_brief/Arcade 2.0 - 2026 Planning Brief v2.pdf`

### Live Demo Flow (Feb 23)
1. Open TAU-Reporting in browser
2. Navigate to Planner > Chat tab
3. Click the 📎 button
4. Upload: `~/Signal/companies/tombola-co-uk/arcade_brief/Arcade 2.0 - 2026 Planning Brief v2.pdf`
5. Wait for "✅ Document loaded - [X] words processed" message
6. Click "📋 Analyze Brief" button
7. Watch the prompt auto-populate in the input field
8. Click "Send"
9. Show loading state: "🤔 Analyzing brief..."
10. Present AI response with media plan recommendations

### Expected Results
- Document badge appears with filename and word count
- Prompt template fills the input field automatically
- AI analyzes the brief and provides:
  - Brief critique and improvement suggestions
  - Paid media plan recommendations
  - Media mix and budget allocations
- Planning state updates automatically if AI provides structured data

## File Changes
- ✅ `src/components/planner/tabs/ChatTab.jsx` - Main component with upload UI
- ✅ `src/services/plannerChat.js` - Service layer for document handling
- ✅ `package.json` - Added `pdfjs-dist` dependency

## Known Limitations
- DOCX support not yet implemented (shows "coming soon" message)
- Documents truncated at 50,000 characters
- Large PDFs (>10MB) are rejected
- Requires internet connection for PDF worker CDN

## Demo Tips for Rob
1. **Pre-load the document** before the meeting starts to avoid upload wait time
2. **Show the quick action buttons** - emphasize how easy it is
3. **Point out the visual feedback** - badges, loading states, success messages
4. **Demonstrate the auto-populated prompt** - no typing needed!
5. **Highlight real-time analysis** - this is a live AI analyzing their actual brief
6. **Show the media plan updates** - budgets sync automatically to the platform

## Troubleshooting

**If document upload fails:**
- Check browser console for errors
- Verify file is a valid PDF
- Try the .txt version: `~/Signal/companies/tombola-co-uk/arcade_brief/arcade_brief.txt`

**If AI response is slow:**
- This is expected for large documents (30-60 seconds)
- Loading message lets user know it's processing

**If build fails:**
- Run: `npm install pdfjs-dist`
- Verify Vite config allows external CDN resources

## Next Steps (Post-Demo)
- Add DOCX support using `mammoth.js`
- Add document history/library
- Allow multiple document upload
- Add document comparison feature
- Extract structured data from brief (objectives, KPIs, etc.)
