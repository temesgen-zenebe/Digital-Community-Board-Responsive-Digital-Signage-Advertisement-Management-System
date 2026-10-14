import React, { useState } from 'react';
import {
  TOP_STORES_FINDINGS,
  CATEGORY_FINDINGS,
  generateDailyTrendData,
} from '../data/findingsData';
import { Download, Search, Table as TableIcon } from 'lucide-react';

export const DataTableView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stores' | 'categories' | 'daily'>('stores');
  const [searchTerm, setSearchTerm] = useState('');

  const dailyData = generateDailyTrendData();

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (activeTab === 'stores') {
      csvContent += 'Rank,Store Name,City,State,Revenue,Orders,Active Listings,Avg Ticket,Screen Uptime\n';
      TOP_STORES_FINDINGS.forEach((s) => {
        csvContent += `${s.rank},"${s.name}","${s.city}","${s.state}",${s.revenue},${s.orders},${s.activeListings},${s.avgOrderValue},"${s.screenUptime}"\n`;
      });
    } else if (activeTab === 'categories') {
      csvContent += 'Category,Percentage,Platform Listings,Flagship Listings,Avg Fee,Top Examples\n';
      CATEGORY_FINDINGS.forEach((c) => {
        csvContent += `"${c.name}",${c.percentage}%,${c.platformCount},${c.storeCount},${c.avgFee},"${c.topExamples.join('; ')}"\n`;
      });
    } else {
      csvContent += 'Day,Date,Weekday,Platform Revenue,Platform Views,Platform Users,Platform Orders,Store Revenue,Store Views\n';
      dailyData.forEach((d) => {
        csvContent += `${d.day},"${d.dateStr}","${d.weekday}",${d.platformRevenue},${d.platformViews},${d.platformUsers},${d.platformOrders},${d.storeRevenue},${d.storeViews}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `community_board_${activeTab}_findings.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 p-6">
      {/* Table Header and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Raw Findings Data
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500">Accessible Structured View</span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-serif mt-1">
            Data Matrix & Export
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Table Tab selector */}
          <div className="flex items-center p-1 bg-stone-100 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('stores')}
              className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                activeTab === 'stores'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Stores ({TOP_STORES_FINDINGS.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                activeTab === 'categories'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Categories ({CATEGORY_FINDINGS.length})
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                activeTab === 'daily'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Daily Timeline (31)
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter / Search input */}
      <div className="mb-4 relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter data rows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-700"
        />
      </div>

      {/* Render active table */}
      <div className="overflow-x-auto border border-stone-200 rounded-lg">
        {activeTab === 'stores' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Store Name</th>
                <th className="p-3">Location</th>
                <th className="p-3 text-right">Revenue</th>
                <th className="p-3 text-right">Orders</th>
                <th className="p-3 text-right">Active Listings</th>
                <th className="p-3 text-right">Avg Order</th>
                <th className="p-3 text-right">Uptime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {TOP_STORES_FINDINGS.filter((s) =>
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.city.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((s) => (
                <tr key={s.id} className="hover:bg-amber-50/40">
                  <td className="p-3 font-mono font-medium text-stone-500">#{s.rank}</td>
                  <td className="p-3 font-semibold text-stone-900">{s.name}</td>
                  <td className="p-3 text-stone-600">{s.city}, {s.state}</td>
                  <td className="p-3 text-right font-mono font-bold text-stone-900">
                    ${s.revenue.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono text-stone-700">{s.orders}</td>
                  <td className="p-3 text-right font-mono text-stone-700">{s.activeListings}</td>
                  <td className="p-3 text-right font-mono text-stone-700">
                    ${s.avgOrderValue.toFixed(2)}
                  </td>
                  <td className="p-3 text-right text-emerald-700 font-medium">
                    {s.screenUptime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'categories' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Share (%)</th>
                <th className="p-3 text-right">Platform Volume</th>
                <th className="p-3 text-right">Flagship Volume</th>
                <th className="p-3 text-right">Avg Duration Fee</th>
                <th className="p-3">Common Postings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {CATEGORY_FINDINGS.filter((c) =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.description.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((c) => (
                <tr key={c.id} className="hover:bg-amber-50/40">
                  <td className="p-3 font-semibold text-stone-900 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-xs"
                      style={{ backgroundColor: c.color }}
                    />
                    {c.name}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-stone-900">
                    {c.percentage}%
                  </td>
                  <td className="p-3 text-right font-mono text-stone-700">
                    {c.platformCount.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono text-stone-700">
                    {c.storeCount}
                  </td>
                  <td className="p-3 text-right font-mono font-medium text-stone-900">
                    ${c.avgFee.toFixed(0)}
                  </td>
                  <td className="p-3 text-stone-500">
                    {c.topExamples.slice(0, 2).join(' · ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'daily' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Day</th>
                <th className="p-3 text-right">Platform Revenue</th>
                <th className="p-3 text-right">Screen Views</th>
                <th className="p-3 text-right">Unique Users</th>
                <th className="p-3 text-right">Orders</th>
                <th className="p-3 text-right">Flagship Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {dailyData
                .filter((d) =>
                  d.dateStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  d.weekday.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((d) => (
                  <tr
                    key={d.day}
                    className={`hover:bg-amber-50/40 ${
                      d.isWeekend ? 'bg-stone-50/60 font-medium' : ''
                    }`}
                  >
                    <td className="p-3 font-mono font-medium text-stone-900">
                      {d.dateStr}
                    </td>
                    <td className="p-3 text-stone-600">
                      {d.weekday} {d.isWeekend && '(Weekend)'}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-stone-900">
                      ${d.platformRevenue.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono text-stone-700">
                      {d.platformViews.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono text-stone-700">
                      {d.platformUsers.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono text-stone-700">
                      {d.platformOrders}
                    </td>
                    <td className="p-3 text-right font-mono text-amber-900 font-medium">
                      ${d.storeRevenue}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
