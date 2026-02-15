#!/bin/bash
echo "📊 Analyzing bundle size..."

ANALYZE=true pnpm --filter web build

echo "✅ Bundle analysis complete!"
echo "Open the generated HTML files to see the report"
