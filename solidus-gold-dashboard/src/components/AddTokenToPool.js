import { Typography, Card, Grid, TextField, Button } from "@mui/material"
function AddTokenToPool(){
    return (
        <div style={{ marginLeft: '5px', maxWidth: '600px' }}>
        <Card variant="outlined" style={{ marginBottom: '20px' }}>
            <Typography variant="h6" style={{ padding: '16px' }}>Add Token To Pool</Typography>
            <Grid container spacing={3} style={{ padding: '16px' }}>
                    <Grid item xs={12}>
                        Token Address
                        <TextField/>
                        <br/>
                        Supply Cap
                        <TextField/> 
                        <br/>
                        Minimum Risk Parameter
                        <TextField/>
                        <br/>
                        Maximum Risk Parameter
                        <TextField/> 
                        <br/>
                        Token decimals
                        <TextField/> 
                    </Grid>
            </Grid>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Button variant='contained' >Add Token</Button>
        
            <Button>Cancel</Button>
        </div>
        </div>
    )
}
export default AddTokenToPool

