import Snackbar from "@mui/material/Snackbar";

const Snack = ({message,snackState,handleOnClose,timeOpen = 3000}) => {
    return (
        <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackState}
        autoHideDuration={timeOpen}
        message={message}
        onClose={handleOnClose}
        />
    );
}
 
export default Snack;