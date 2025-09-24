
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
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


export default function MyTable() {
  const [rows, setRows] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [rowsPerPage, setRowsPerPage] = useState(Number(searchParams.get('rowsPerPage')) || 10);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 0);
  const [platformFilter, setPlatformFilter] = useState(searchParams.get('platform') || 'All');
  const [tag1Filter, setTag1Filter] = useState(searchParams.get('tag1') || 'All');
  const [tag2Filter, setTag2Filter] = useState(searchParams.get('tag2') || 'All');
  const [tag3Filter, setTag3Filter] = useState(searchParams.get('tag3') || 'All');
  const [trlFilter, setTrlFilter] = useState(searchParams.get('trl') || 'All');
  const [selectedRowId, setSelectedRowId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch('http://localhost:3001/api/data')
      .then(res => res.json())
      .then(data => setRows(data));
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
  const trls = React.useMemo(() => {
    const set = new Set(rows.map(r => r["Anticipated TRL"]).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [rows]);

  // Filtering logic
  const filteredRows = React.useMemo(() => {
    return rows
      .map((row, idx) => ({ ...row, ID: idx + 1 }))
      .filter(row =>
        (platformFilter === 'All' || row['Technology platform'] === platformFilter) &&
        (tag1Filter === 'All' || row['Tag 1'] === tag1Filter) &&
        (tag2Filter === 'All' || row['Tag 2'] === tag2Filter) &&
        (tag3Filter === 'All' || row['Tag 3'] === tag3Filter) &&
        (trlFilter === 'All' || row['Anticipated TRL'] === trlFilter)
      );
  }, [rows, platformFilter, tag1Filter, tag2Filter, tag3Filter, trlFilter]);

  // Pagination logic
  const startIdx = page * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const pagedRows = filteredRows.slice(startIdx, endIdx);

  // Handlers
  const handleRowSelect = (id) => {
    setSelectedRowId(id);
  };
  const handleDetailsClick = () => {
    if (selectedRowId) {
      navigate(`/details/${selectedRowId}${location.search}`);
    }
  };
  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
      setSearchParams(prev => ({
        ...Object.fromEntries(prev.entries()),
        page: page - 1
      }));
    }
  };
  const handleNextPage = () => {
    if (endIdx < filteredRows.length) {
      setPage(page + 1);
      setSearchParams(prev => ({
        ...Object.fromEntries(prev.entries()),
        page: page + 1
      }));
    }
  };
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(0);
    setSearchParams(prev => ({
      ...Object.fromEntries(prev.entries()),
      rowsPerPage: e.target.value,
      page: 0
    }));
  };

  return (
    <>
      {/* Filter Dropdowns */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2, maxWidth: '90vw', mx: 'auto' }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="platform-filter-label">Technology Platform</InputLabel>
          <Select
            labelId="platform-filter-label"
            value={platformFilter}
            label="Technology Platform"
            onChange={e => {
              setPlatformFilter(e.target.value);
              setPage(0);
              setSearchParams(prev => ({
                ...Object.fromEntries(prev.entries()),
                platform: e.target.value,
                page: 0
              }));
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
              setSearchParams(prev => ({
                ...Object.fromEntries(prev.entries()),
                tag1: e.target.value,
                page: 0
              }));
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
              setSearchParams(prev => ({
                ...Object.fromEntries(prev.entries()),
                tag2: e.target.value,
                page: 0
              }));
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
              setSearchParams(prev => ({
                ...Object.fromEntries(prev.entries()),
                tag3: e.target.value,
                page: 0
              }));
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
              setSearchParams(prev => ({
                ...Object.fromEntries(prev.entries()),
                trl: e.target.value,
                page: 0
              }));
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
                key={row.ID}
                selected={selectedRowId === row.ID}
                onClick={() => handleRowSelect(row.ID)}
                sx={theme => ({
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  backgroundColor: selectedRowId === row.ID ? theme.palette.primary.main : undefined,
                  color: selectedRowId === row.ID ? theme.palette.primary.contrastText : undefined,
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
          disabled={!selectedRowId}
          onClick={handleDetailsClick}
        >
          Go to Details
        </Button>
      </Box>
    </>

  );
}

