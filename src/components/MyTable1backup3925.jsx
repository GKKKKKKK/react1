
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const allColumns = [
  "Number",
  "Technology platform",
  "Insight name",
  "Company",
  "Owner/named contact",
  "Country",
  "Tag 1",
  "Tag 2",
  "Tag 3",
  "Anticipated TRL",
  "Description of technology",
  "Relevance to paper sacks",
  "Environmental credentials",
  "Current status",
  "Potential challenges and points requiring further investigation",
  "General contact details",
  "Email contact if available",
  "Web pages",
  "Year of entry into the database",
  "Additional notes",
  "Status update",
  "Recommended"
];

const defaultColumns = [
  "ID", // new column for unique id
  "Insight name",
  "Technology platform",
  "Tag 1",
  "Tag 2",
  "Tag 3",
  "Description of technology",
  "Anticipated TRL"
];

function MyTable1() {
  // Edit and Delete dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [originalInsightName, setOriginalInsightName] = useState(null);

  const handleEditEntry = () => {
    setEditData(selectedRowData);
    setOriginalInsightName(selectedRowData["Insight name"]);
    setEditOpen(true);
  };

  // Helper to fetch table data
  const fetchTableData = () => {
    fetch('http://localhost:3001/api/data')
      .then(res => res.json())
      .then(data => {
        const withIds = data.map(row => ({ ...row, uniqueId: generateUniqueId() }));
        setRows(withIds);
      });
  };

  const handleEditSave = async () => {
    const insightName = encodeURIComponent(originalInsightName);
    try {
      const response = await fetch(`http://localhost:3001/api/entries/${insightName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (!response.ok) {
        alert('Failed to save changes!');
        return;
      }
      setEditOpen(false);
      setOriginalInsightName(null);
      // Fetch new data, then update details if needed
      fetch('http://localhost:3001/api/data')
        .then(res => res.json())
        .then(data => {
          const withIds = data.map(row => ({ ...row, uniqueId: row.uniqueId || (row["Insight name"] + Math.random()) }));
          setRows(withIds);
          if (showDetails && originalInsightName) {
            const updated = withIds.find(row => row["Insight name"] === originalInsightName);
            if (updated) setSelectedRowData(updated);
          }
        });
    } catch (err) {
      alert('Network or server error!');
    }
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleDeleteEntry = async () => {
    const insightName = encodeURIComponent(selectedRowData?.["Insight name"]);
    if (!insightName) return;
    await fetch(`http://localhost:3001/api/entries/${insightName}`, { method: 'DELETE' });
  // ...existing code (all hooks, handlers, and logic) should be inside this function...
    setShowDetails(false);
    setSelectedRowId(null);
    setSelectedRowData(null);
    // Optimistically remove from local state for instant UI update
    setRows(prevRows => prevRows.filter(row => row["Insight name"] !== selectedRowData["Insight name"]));
    setTimeout(() => {
      fetchTableData();
    }, 300);
  };

    // Create dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [createData, setCreateData] = useState(() => Object.fromEntries(allColumns.filter(col => col !== 'ID').map(col => [col, ''])));

  const handleCreateOpen = () => {
    setCreateData(Object.fromEntries(allColumns.filter(col => col !== 'ID').map(col => [col, ''])));
    setCreateOpen(true);
  };

  const handleCreateChange = (field, value) => {
    setCreateData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateSave = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createData),
      });
      if (!response.ok) {
        alert('Failed to create entry!');
        return;
      }
      setCreateOpen(false);
      fetchTableData();
    } catch (err) {
      alert('Network or server error!');
    }
  };
  
  const [rows, setRows] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [platformFilter, setPlatformFilter] = useState('All');
  const [tag1Filter, setTag1Filter] = useState('All');
  const [tag2Filter, setTag2Filter] = useState('All');
  const [tag3Filter, setTag3Filter] = useState('All');
  const [trlFilter, setTrlFilter] = useState('All');
  const [descSearch, setDescSearch] = useState('');
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Helper to generate a unique id
  function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  useEffect(() => {
    fetchTableData();
  }, []);

  // Memoized unique values for filter dropdowns
  const platforms = React.useMemo(() => {
    const set = new Set(rows.map(r => r["Technology platform"]).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [rows]);
  const tag1s = React.useMemo(() => {
    const set = new Set(rows.map(r => r["Tag 1"]).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [rows]);
  const tag2s = React.useMemo(() => {
    const set = new Set(rows.map(r => r["Tag 2"]).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [rows]);
  const tag3s = React.useMemo(() => {
    const set = new Set(rows.map(r => r["Tag 3"]).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [rows]);
  // Anticipated TRL filter: options 1-9 as numbers, plus 'All', 'Unknown', 'Not applicable'
  const trls = React.useMemo(() => {
    return [
      "All",
      ...Array.from({ length: 9 }, (_, i) => (i + 1).toString()),
      "Unknown",
      "Not applicable"
    ];
  }, []);

  // Filtering logic
  const filteredRows = React.useMemo(() => {
    return rows
      .map((row, idx) => ({ ...row, ID: idx + 1 })) // Keep ID for display
      .filter(row =>
        (platformFilter === 'All' || row['Technology platform'] === platformFilter) &&
        (tag1Filter === 'All' || row['Tag 1'] === tag1Filter) &&
        (tag2Filter === 'All' || row['Tag 2'] === tag2Filter) &&
        (tag3Filter === 'All' || row['Tag 3'] === tag3Filter) &&
        (
          trlFilter === 'All' ||
          (
            trlFilter === 'Unknown' &&
              (row['Anticipated TRL']?.toLowerCase() === 'unknown')
          ) ||
          (
            trlFilter === 'Not applicable' &&
              (row['Anticipated TRL']?.toLowerCase() === 'not applicable')
          ) ||
          (() => {
            const trlValue = row['Anticipated TRL'];
            const selected = parseInt(trlFilter);
            if (!trlValue || isNaN(selected)) return false;
            // If it's a range like '2-4' or '3–5'
            const match = trlValue.match(/^(\d+)\s*[-–]\s*(\d+)$/);
            if (match) {
              const min = parseInt(match[1], 10);
              const max = parseInt(match[2], 10);
              return selected >= min && selected <= max;
            }
            // Otherwise, treat as single number
            const trl = parseInt(trlValue);
            return trl === selected;
          })()
        ) &&
        (
          !descSearch ||
          (row['Description of technology']?.toLowerCase().includes(descSearch.toLowerCase()))
        )
      );
  }, [rows, platformFilter, tag1Filter, tag2Filter, tag3Filter, trlFilter, descSearch]);

  // Reset page to 0 whenever any filter/search changes
  useEffect(() => {
    setPage(0);
  }, [platformFilter, tag1Filter, tag2Filter, tag3Filter, trlFilter, descSearch]);

  // Pagination logic
  const startIdx = page * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const pagedRows = filteredRows.slice(startIdx, endIdx);

  // Handlers
  const handleRowSelect = (uniqueId) => {
    setSelectedRowId(uniqueId);
  };
  const handleDetailsClick = () => {
    if (selectedRowId) {
      // Find the row in the full, unfiltered data by uniqueId
      const row = rows.find(row => row.uniqueId === selectedRowId);
      setSelectedRowData(row);
      setShowDetails(true);
    }
  };
  const handleBackToTable = () => {
    setShowDetails(false);
    setSelectedRowId(null);
    setSelectedRowData(null);
  };
  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };
  const handleNextPage = () => {
    if (endIdx < filteredRows.length) {
      setPage(page + 1);
    }
  };
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(0);
  };

  // Use selectedRowData in details view for robustness

  // Debug: log selectedRowData
  console.log('selectedRowData:', selectedRowData);

  const loading = rows.length === 0;

  return (
    <>
      {!showDetails ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, maxWidth: '90vw', mx: 'auto' }}>
            <Button variant="contained" color="primary" onClick={handleCreateOpen}>
              Create New Entry
            </Button>
          </Box>
        {/* Create Dialog */}
        <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
          <DialogTitle>Create New Entry</DialogTitle>
          <DialogContent>
            {allColumns.filter(col => col !== 'ID').map(col => (
              <TextField
                key={col}
                margin="dense"
                label={col}
                fullWidth
                value={createData?.[col] || ''}
                onChange={e => handleCreateChange(col, e.target.value)}
                sx={{ mb: 1 }}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateSave} variant="contained">Create</Button>
          </DialogActions>
        </Dialog>
          {/* Filter Dropdowns */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2, maxWidth: '90vw', mx: 'auto' }}>
            <TextField
              id="desc-search"
              label="Search Tech Description"
              variant="outlined"
              size="small"
              value={descSearch}
              onChange={e => setDescSearch(e.target.value)}
              sx={{ minWidth: 240 }}
            />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="platform-filter-label">Technology Platform</InputLabel>
              <Select
                labelId="platform-filter-label"
                value={platformFilter}
                label="Technology Platform"
                onChange={e => {
                  setPlatformFilter(e.target.value);
                  setPage(0);
                }}
              >
                {platforms.map(p => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel id="tag1-filter-label">Tag 1</InputLabel>
              <Select
                labelId="tag1-filter-label"
                value={tag1Filter}
                label="Tag 1"
                onChange={e => {
                  setTag1Filter(e.target.value);
                  setPage(0);
                }}
              >
                {tag1s.map(p => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel id="tag2-filter-label">Tag 2</InputLabel>
              <Select
                labelId="tag2-filter-label"
                value={tag2Filter}
                label="Tag 2"
                onChange={e => {
                  setTag2Filter(e.target.value);
                  setPage(0);
                }}
              >
                {tag2s.map(p => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel id="tag3-filter-label">Tag 3</InputLabel>
              <Select
                labelId="tag3-filter-label"
                value={tag3Filter}
                label="Tag 3"
                onChange={e => {
                  setTag3Filter(e.target.value);
                  setPage(0);
                }}
              >
                {tag3s.map(p => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="trl-filter-label">Anticipated TRL</InputLabel>
              <Select
                labelId="trl-filter-label"
                value={trlFilter}
                label="Anticipated TRL"
                onChange={e => {
                  setTrlFilter(e.target.value);
                  setPage(0);
                }}
              >
                {trls.map(p => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <TableContainer component={Paper} sx={{ px: 8, maxWidth: '90vw', mx: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {defaultColumns.map(col => (
                    <TableCell key={col}>{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedRows.map((row) => (
                  <TableRow
                    hover
                    key={row.uniqueId}
                    selected={selectedRowId === row.uniqueId}
                    onClick={() => handleRowSelect(row.uniqueId)}
                    sx={theme => ({
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      backgroundColor: selectedRowId === row.uniqueId ? theme.palette.primary.main : undefined,
                      color: selectedRowId === row.uniqueId ? theme.palette.primary.contrastText : undefined,
                    })}
                  >
                    {defaultColumns.map(col => (
                      <TableCell key={col}>{row[col] || ''}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Controls and Details Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
            <IconButton onClick={handlePrevPage} disabled={page === 0}>
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ mx: 2 }}>
              Page {page + 1} of {Math.max(1, Math.ceil(filteredRows.length / rowsPerPage))}
            </Box>
            <IconButton onClick={handleNextPage} disabled={endIdx >= filteredRows.length}>
              <ArrowForwardIcon />
            </IconButton>
            <FormControl size="small" sx={{ ml: 4, minWidth: 120 }}>
              <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
              <Select
                labelId="rows-per-page-label"
                value={rowsPerPage}
                label="Rows per page"
                onChange={handleRowsPerPageChange}
              >
                {[5, 10, 20, 50, 100].map(num => (
                  <MenuItem key={num} value={num}>{num}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              sx={{ ml: 4 }}
              disabled={loading || !selectedRowId}
              onClick={handleDetailsClick}
            >
              Show Details
            </Button>
          </Box>
        </>
      ) : (
        <Box sx={{ maxWidth: '900px', mx: 'auto', mt: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button variant="outlined" onClick={handleBackToTable}>
              Back to Table
            </Button>
            <Button variant="outlined">
              Create PDF
            </Button>
            <Button variant="outlined" color="primary" onClick={handleEditEntry}>
              Edit Entry
            </Button>
            <Button variant="outlined" color="error" onClick={handleDeleteEntry}>
              Delete Entry
            </Button>
          </Box>
          <Paper sx={{ p: 3 }}>
            <h2>{selectedRowData?.["Insight name"] || selectedRowData?.ID || "Details"}</h2>
            {selectedRowData ? (
              <Table size="small">
                <TableBody>
                  {allColumns.map(col => (
                    <TableRow key={col}>
                      <TableCell sx={{ fontWeight: 'bold', width: 220 }}>{col}</TableCell>
                      <TableCell>{selectedRowData[col] || ''}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div>No details found.</div>
            )}
          </Paper>
        {/* Edit Dialog */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
          <DialogTitle>Edit Entry</DialogTitle>
          <DialogContent>
            {allColumns.filter(col => col !== 'ID').map(col => (
              <TextField
                key={col}
                margin="dense"
                label={col}
                fullWidth
                value={editData?.[col] || ''}
                onChange={e => handleEditChange(col, e.target.value)}
                sx={{ mb: 1 }}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSave} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
        </Box>
      )}
    </>
  );
}

export default MyTable1;

