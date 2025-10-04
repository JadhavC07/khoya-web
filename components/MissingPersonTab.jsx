"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlerts } from "../redux/alertsSlice";
import { RootState, AppDispatch } from "../redux/store";

export default function MissingPersonTab() {
  const dispatch = useDispatch();
  const { alerts, status, error } = useSelector((state) => state.alerts);

  useEffect(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);

  if (status === "loading") return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div>
      <h2>Missing Persons</h2>
      <ul>
        {alerts.map((alert) => (
          <li key={alert.id}>
            <img
              src={alert.imageUrl}
              alt={alert.title}
              style={{ width: 100 }}
            />
            <h3>{alert.title}</h3>
            <p>{alert.description}</p>
            <span>Location: {alert.location}</span>
            <span>
              Posted By: {alert.postedBy.name} ({alert.postedBy.email})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
