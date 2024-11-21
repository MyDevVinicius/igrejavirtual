// pages/dashboard/index.tsx
"use client";

import React from "react";
import Layout from "./layout";
import Dashboard from "../components/Dashboard/Dashboard";
import TableList from "../components/TabelaContas/TabelaList";

const DashboardPage = () => {
  return (
    <Layout>
      <div className="space-y-5 p-4">
        <Dashboard />
        <TableList />
      </div>
    </Layout>
  );
};

export default DashboardPage;
