/*
  react-interview-q1
  Answer by: James Ward
  
  Gneral Notes: I opted to use a combination of Material UI and React-Table to complete this exercise. 
  The reason for the react-table is it was in the end a simpler implementation than the table from MUI.
  I added a modal when the user clicks on clear as kind of a additional step because it was not clear if 
  the data table should be cleared as well or only the input fields. This way the user can decide if the 
  data table should also be cleared.

*/

// React
import { useEffect, useState } from 'react';

// Material UI 
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Ract-Table 
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";

// Mock-Api
import {getLocations, isNameValid} from "./mock-api/apis";

let nodes = []; // variable used for the nodes within the data table.
let counter = 0; // counter used to help generate a unique id for the data table entry.

function App() {
  // Setup react states to be used through the example.
  const [data, setData] = useState({ nodes });
  const [locations, setLocations ] = useState([]);
  const [isError, setIsError ] = useState(false);
  const [errorText, setErrorText ] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [isLocationError, setIsLocationError] = useState(false);
  const [locationErrorMessage, setLocationErrorMessage] = useState("");

  // Used for the modal.
  const [open, setOpen] = useState(false);

  // Used useEffect to load the initial data needed to populate the slect drop down.
  useEffect(()=>{
    // Used an async method so as to use await for the getLocations method instead of the ".then" approach.
    const getLocals = async () =>{
      var locals = await getLocations();
      var dropDownItems = []; // Will be used to create the array of selections and placed in the locations state to populate the select menu.

      locals.map((local)=>{
        dropDownItems.push({
          value: local,
          label: local,
        });
      });
      setLocations(dropDownItems);
    }
    getLocals(); // Triggers the call to the async method.
  },[]);

  // Setups the columns for the data table.    
  const COLUMNS = [
    { label: 'Name', renderCell: (item) => item.name },
    { label: 'Location', renderCell: (item) => item.location }
  ];

  // Creates the theme used for the data table.
  const theme = useTheme({
    HeaderRow: `
        background-color: #D3D3D3;
        font-size: 20px;
        .th {
          border-bottom: 3px solid #000;
        }
      `,
    Row: `
        font-size: 18px;
        &:nth-of-type(odd) {
          background-color: #FFF;
        }
        &:nth-of-type(even) {
          background-color: #DCDCDC;
        }
      `,
      BaseCell: `
      padding-left: 11px;
      &:not(:last-of-type) {
            border-right: 3px solid #000;
          }
        `,
  });

  // Handles the submission of the add button on click.
  const handleSubmit = (event) => {
    // Makes sure all the error handling is defualted to off before proceeding.
    setIsError(false);
    setErrorText("");
    setIsLocationError(false);
    setLocationErrorMessage("");
    
    // Added some error hadling incase the used tries to submit without filling in a name or selecting a location.
    if(name.length === 0  || location.length === 0){
      if(name === null || name === undefined || name.length === 0){
        setIsError(true);
        setErrorText("Name can not be empty");
      }
      if(location === null || location === undefined || location.length === 0){
        setIsLocationError(true);
        setLocationErrorMessage("Must select a location");
      }  
    }
    else{
      counter++;
      checkName();  
    }

    event.preventDefault();
  }

  // Runs the provided isNameValid logic as well as some additional chack logic.
  const checkName = async () => {
    var result = await isNameValid(name)
    if(result){
      // opted to add an additional check to see if a name is present in the data table and if it is treat it just like the mock api does. It's intend as a bit of additional flavor.
      var existingName = data.nodes.filter((item) =>
        item.name.toLowerCase().includes(name)
      );
      // If the name exist we set the error and message for the error.
      if(existingName.length > 0){
        setIsError(true);
        setErrorText("this name has already been taken");
      }
      else{
        // If everything checks out we update the data table.
        updateTable();
      }
    }
    else{
      setIsError(true);
      setErrorText("this name has already been taken");
    }
  }

  // Add entries to the data table.
  const updateTable= () => {
    var id = counter;
    setData((state) => ({
      ...state,
      nodes: state.nodes.concat({
        id,
        name: name,
        location:location
      }),
    }));
  }

  // Closes the modal and does the basic clear.
  const handleClose = () => {
    setOpen(false);
    setIsError(false);
    setErrorText("");
    setName("");
    setLocation("");
    setIsLocationError(false);
    setLocationErrorMessage("");
  };


  // Clears the text fields only.
  const clear = () => {
    setOpen(true);
  }

  // Clears the inputs as well as the data table and closes the modal.
  const clearAll = () =>{
    setIsError(false);
    setErrorText("");
    setName("");
    setLocation("");
    setIsLocationError(false);
    setLocationErrorMessage("");
    setOpen(false);
    setData({nodes});
  }

  return (
    <Container maxWidth="md">
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 3, width: '100%' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
            error = {isError}
            id="outlined-error-helper-text"
            label="Name"
            value={name}
            helperText={errorText}
            onChange={e => {
              setIsError(false);
              setErrorText("");
              setName(e.target.value)
            }}
            
        />
        <TextField
            error={isLocationError}
            id="outlined-select-currency"
            select
            label="Location"
            value={location}
            helperText={locationErrorMessage}
            onChange={e => {
              setIsLocationError(false);
              setLocationErrorMessage("");
              setLocation(e.target.value);
            }}
        >
          {
            locations.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
        </TextField>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" style={{"color":"#000", borderColor:"#000"}} onClick={clear}>Clear</Button>
          <Button variant="contained" color="success" type="submit">Add</Button>
        </Stack>
        
        <div style={{minHeight:"200px",width:"100%", marginLeft:"25px", marginTop:"25px", border: "3px solid black", overflow:"hidden"}}>
          <CompactTable
            columns={COLUMNS}
            data={data}
            theme={theme}
            layout={{ isDiv: true, fixedHeader: true}}
          />
        </div>
        
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Clear the data table?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Clicking <span style={{color:"red"}}>YES</span> will clear the data table along with the input fields. 
            Clicking NO will only clear the the input fields.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" style={{"color":"#000", borderColor:"#000"}}>No</Button>
          <Button onClick={clearAll} autoFocus variant="contained" color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
