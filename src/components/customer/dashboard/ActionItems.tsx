// src/components/customer/dashboard/ActionItems.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

const ActionItems = () => {
  // Mock data for action items
  const actionItems = [
    {
      id: 1,
      title: "Complete today's workout",
      priority: "high",
      dueTime: "2:00 PM",
      completed: false,
    },
    {
      id: 2,
      title: "Log your meals",
      priority: "medium",
      dueTime: "6:00 PM",
      completed: false,
    },
    {
      id: 3,
      title: "Schedule check-in with coach",
      priority: "low",
      dueTime: "Tomorrow",
      completed: true,
    },
  ];

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Action Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actionItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                item.completed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                {getPriorityIcon(item.priority)}
                <div>
                  <p className={`font-medium ${item.completed ? "line-through text-gray-500" : ""}`}>
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-500">Due: {item.dueTime}</p>
                </div>
              </div>
              {!item.completed && (
                <Button size="sm" variant="outline">
                  Complete
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionItems;