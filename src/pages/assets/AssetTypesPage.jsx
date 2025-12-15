import React, { useMemo, useState, useEffect } from 'react';
import { Plus, Search, Filter, Columns3, Download, RefreshCcw, Edit3, Trash2 } from 'lucide-react';
import Button from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import Card from '../../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '../../components/ui/pagination';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '../../components/ui/dropdown-menu';
import { Select, SelectItem } from '../../components/ui/select';
import AssetTypeForm from '../../components/forms/AssetTypeForm';
import { useAssetTypes } from '../../hooks/useAssetTypes';
import { formatDateTime } from '../../utils/formatDate';

const DEFAULT_COLUMNS = [
  { key: 'assettypename', label: 'Name', required: true },
  { key: 'assettypeprefix', label: 'Prefix' },
  { key: 'assetdepreciationrate', label: 'Depreciation %' },
  { key: 'description', label: 'Description' },
  { key: 'org_name', label: 'Organization' },
  { key: 'addedby_username', label: 'Added By' },
  { key: 'modifieddate', label: 'Modified' },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const AssetTypesPage = () => {
  const {
    assetTypes,
    loading,
    error,
    pagination,
    filters,
    searchAssetTypes,
    filterAssetTypes,
    createAssetType,
    updateAssetType,
    deleteAssetType,
    changePage,
    changePageSize,
    refresh,
    shouldShowPagination,
  } = useAssetTypes();

  const [search, setSearch] = useState(filters.search || '');
  const [orgId, setOrgId] = useState('');
  const [isActive, setIsActive] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const stored = localStorage.getItem('asset_types_visible_columns');
    if (stored) return JSON.parse(stored);
    const defaults = {};
    DEFAULT_COLUMNS.forEach(col => {
      defaults[col.key] = col.required ? true : true;
    });
    return defaults;
  });

  useEffect(() => {
    localStorage.setItem('asset_types_visible_columns', JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  useEffect(() => {
    const handler = setTimeout(() => {
      searchAssetTypes(search.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [search, searchAssetTypes]);

  useEffect(() => {
    const newFilters = {};
    if (orgId !== '') newFilters.orgid = orgId;
    else newFilters.orgid = undefined;
    if (isActive !== '') newFilters.isactive = isActive;
    else newFilters.isactive = undefined;
    filterAssetTypes(newFilters);
  }, [orgId, isActive, filterAssetTypes]);

  const columns = useMemo(() => DEFAULT_COLUMNS, []);

  const toggleColumn = (key) => {
    const col = columns.find(c => c.key === key);
    if (col?.required) return;
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const exportCSV = () => {
    const visible = columns.filter(c => visibleColumns[c.key]);
    const headers = visible.map(c => c.label);
    const rows = assetTypes.map(item => visible.map(c => {
      const value = item[c.key];
      if (c.key === 'modifieddate') return value ? formatDateTime(value) : '';
      return value !== null && value !== undefined ? String(value).replace(/\n/g, ' ').replace(/,/g, ';') : '';
    }));
    const csv = [headers, ...rows].map(r => r.map(field => `"${field}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().slice(0,19).replace(/[:T]/g, '-');
    a.download = `asset-types-${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(`Delete asset type "${item.assettypename}"? This cannot be undone.`);
    if (!confirmed) return;
    await deleteAssetType(item.assettypeid || item.id || item.pk);
  };

  const pageNumbers = useMemo(() => {
    const total = pagination.totalPages || 0;
    const current = pagination.currentPage || 1;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
    return Array.from(pages).filter(p => p >= 1 && p <= total).sort((a, b) => a - b);
  }, [pagination.totalPages, pagination.currentPage]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={RefreshCcw} onClick={refresh}>Refresh</Button>
          <Button variant="outline" icon={Download} onClick={exportCSV}>Export CSV</Button>
          <Button icon={Plus} variant="primary" onClick={() => setShowCreate(true)}>New Type</Button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, prefix, description"
              className="pl-9"
            />
          </div>

          <div className="flex gap-2">
            <Filter className="w-4 h-4 text-gray-500 mt-2" />
            <Input
              type="number"
              inputMode="numeric"
              placeholder="Filter by orgid"
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={isActive} onValueChange={setIsActive}>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="1">Active</SelectItem>
              <SelectItem value="0">Inactive</SelectItem>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" icon={Columns3}>Columns</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map(col => (
                  <DropdownMenuCheckboxItem
                    key={col.key}
                    checked={!!visibleColumns[col.key]}
                    disabled={!!col.required}
                    onCheckedChange={() => toggleColumn(col.key)}
                  >
                    {col.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                {columns.filter(c => visibleColumns[c.key]).map(col => (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ))}
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.filter(c => visibleColumns[c.key]).length + 2}>
                    <div className="flex items-center justify-center py-8 text-gray-600">
                      Loading...
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={columns.filter(c => visibleColumns[c.key]).length + 2}>
                    <div className="flex items-center justify-center py-8 text-red-600">
                      {error}
                    </div>
                  </TableCell>
                </TableRow>
              ) : assetTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.filter(c => visibleColumns[c.key]).length + 2}>
                    <div className="flex items-center justify-center py-8 text-gray-600">
                      No asset types found
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                assetTypes.map((item, idx) => (
                  <TableRow key={item.assettypeid || idx}>
                    <TableCell>{(pagination.currentPage - 1) * pagination.pageSize + idx + 1}</TableCell>
                    {columns.filter(c => visibleColumns[c.key]).map(col => (
                      <TableCell key={col.key}>
                        {col.key === 'modifieddate' ? (item[col.key] ? formatDateTime(item[col.key]) : '') : (item[col.key] ?? '')}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" icon={Edit3} onClick={() => setEditItem(item)}>Edit</Button>
                        <Button size="sm" variant="danger" icon={Trash2} onClick={() => handleDelete(item)}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Rows per page:</span>
            <Select value={String(pagination.pageSize)} onValueChange={(v) => changePageSize(parseInt(v, 10))} className="w-24">
              {PAGE_SIZE_OPTIONS.map(n => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </Select>
            <span>
              {(assetTypes.length > 0) ? `${(pagination.currentPage - 1) * pagination.pageSize + 1} - ${(pagination.currentPage - 1) * pagination.pageSize + assetTypes.length} of ${pagination.count}` : `0 of ${pagination.count}`}
            </span>
          </div>

          {shouldShowPagination && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={(e) => { e.preventDefault(); if (pagination.previous) changePage(Math.max(1, pagination.currentPage - 1)); }} />
                </PaginationItem>
                {pageNumbers.map((p, i, arr) => {
                  const prev = arr[i - 1];
                  const showEllipsis = prev && p - prev > 1;
                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          isActive={p === pagination.currentPage}
                          onClick={(e) => { e.preventDefault(); changePage(p); }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    </React.Fragment>
                  );
                })}
                <PaginationItem>
                  <PaginationNext onClick={(e) => { e.preventDefault(); if (pagination.next) changePage(Math.min(pagination.totalPages, pagination.currentPage + 1)); }} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </Card>

      {showCreate && (
        <AssetTypeForm
          onCancel={() => setShowCreate(false)}
          onSubmit={async (values) => {
            await createAssetType(values);
            setShowCreate(false);
          }}
          loading={loading}
        />
      )}

      {!!editItem && (
        <AssetTypeForm
          assetType={editItem}
          onCancel={() => setEditItem(null)}
          onSubmit={async (values) => {
            await updateAssetType(editItem.assettypeid || editItem.id || editItem.pk, values);
            setEditItem(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

export default AssetTypesPage;


