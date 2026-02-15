# Quick Start Guide

Get the CarShield CTV Dashboard running in 3 simple steps:

## Step 1: Install Dependencies

```bash
cd carshield-demo
npm install
```

This will install:
- React 18
- Vite (build tool)
- Tailwind CSS (styling)
- Recharts (charts)
- All necessary build dependencies

## Step 2: Start Development Server

```bash
npm run dev
```

The dashboard will open at `http://localhost:5173`

## Step 3: Explore the Dashboard

The demo includes:
- **4 Key Metric Cards** at the top
- **Interactive USA Map** - click DMA regions to see details
- **Daily Performance Chart** - line chart showing delivery trends
- **CTV Provider Mix** - breakdown by platform with pie chart
- **Previous Campaign Card** - historical results
- **Statistical Confidence** - test significance metrics

## Making Changes

### Update Data
Edit `src/data/dashboardData.js` to change any metrics, regions, or values.

### Modify Styling
Components use Tailwind CSS classes. Edit directly in component files.

### Add Features
All components are in `src/components/` - fully modular and reusable.

## Production Build

```bash
npm run build
```

Output will be in `dist/` directory, ready for deployment.

## Need Help?

- Check `README.md` for full documentation
- View component code in `src/components/`
- Data structure is in `src/data/dashboardData.js`

---

**Enjoy your CarShield CTV Dashboard! 🚀**
