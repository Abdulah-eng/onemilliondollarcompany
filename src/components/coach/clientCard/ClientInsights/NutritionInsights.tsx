// src/components/coach/clientCard/ClientInsights/NutritionInsights.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Utensils } from 'lucide-react';
import { mockClientData } from '@/mockdata/clientCard/mockClientData';

interface NutritionInsightsProps {
  nutritionData: typeof mockClientData.nutrition;
}

const NutritionInsights: React.FC<NutritionInsightsProps> = ({ nutritionData }) => {
  return (
    <div>
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Utensils className="w-6 h-6 text-yellow-500" />
          Nutrition Insights
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Key metrics for tracking dietary habits.
        </p>
      </CardHeader>
      <CardContent className="p-0 grid grid-cols-2 gap-6">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold text-foreground">{nutritionData.adherence}%</span>
          <span className="text-sm text-muted-foreground">Meal Adherence</span>
          <p className="text-xs text-center text-muted-foreground mt-1">
            {nutritionData.adherenceMessage}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold text-foreground">
            <span className="text-xl">~</span>{nutritionData.portionsPerDay}
          </span>
          <span className="text-sm text-muted-foreground">Portions/Day</span>
          <p className="text-xs text-center text-muted-foreground mt-1">
            {nutritionData.portionMessage}
          </p>
        </div>
        <div className="col-span-2 space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground">Micronutrient Highlights:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(nutritionData.micronutrientStatus).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1 text-sm">
                <span className={`text-lg ${value === 'adequate' ? 'text-green-500' : 'text-orange-500'}`}>
                  {value === 'adequate' ? '✅' : '⚠️'}
                </span>
                <span className="text-foreground capitalize">{key}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default NutritionInsights;
