import mongoose,{Schema} from "mongoose";
const medicalhistorySchema= new mongoose.Schema(
{
patientId:{type:String, required:true},


},
{
    timestamps:true,
}
);
export default mongoose.model