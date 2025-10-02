import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function AboutDB() {
  return (
   <Box
      sx={{
        borderRadius: 2,
        p: 4,
        boxShadow: 2,
        maxWidth: 500,
        width: "100%",
        mb: 4,
      }}
    >
      <Typography variant="body1" align="left">
        This innovations database is developed by the European Paper Sack Research Group (ESG)
        to support the sector's ten year roadmap. The roadmap identifies a number of strategic
        objectives for the industry, and the technology scouting programme aims to database aims to showcase
        innovations which have the potential to support the achievement of these objectives. 
        In particular, the database aims to showcase innovations which have the potential to:
        
      </Typography>
      <ul style={{ paddingLeft: "1.5rem" }}>
        <li>
          Make paper sacks more bio-based, reducing the reliance on fossil-based polymers to 
          provide certain functionality
        </li>
        <li>
          Enhance the recyclability of paper sacks through material innovations or sorting and 
          reprocessing techniques
        </li>
        <li>
          Reduce the carbon impact of sack kraft paper and paper sack production
        </li>
      </ul>
    </Box>
  );
}

export default AboutDB;