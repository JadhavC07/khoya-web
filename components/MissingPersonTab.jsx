"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlerts } from "@/redux/alertsSlice";
import { RootState, AppDispatch } from "@/redux/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, User, Calendar } from "lucide-react";
import Image from "next/image";

export default function MissingPersonTab() {
  const dispatch = useDispatch();
  const { alerts, status, error } = useSelector((state) => state.alerts);

  useEffect(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-48 w-full rounded-md" />
              <Skeleton className="h-6 w-3/4 mt-4" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error loading alerts: {error}</AlertDescription>
      </Alert>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Missing Persons Reported</CardTitle>
          <CardDescription>
            There are currently no active missing person alerts in your area.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {alerts.map((alert) => (
        <Card
          key={alert.id}
          className="overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="relative h-48 w-full bg-muted">
            <Image
              src={alert.imageUrl || "/placeholder-user.jpg"}
              alt={alert.title}
              fill
              className="object-cover"
            />
          </div>
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg leading-tight">
                {alert.title}
              </CardTitle>
              <Badge
                variant={alert.status === "active" ? "default" : "secondary"}
              >
                {alert.status}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">
              {alert.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{alert.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Posted by {alert.postedBy.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
