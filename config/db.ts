import mongoose, { ConnectOptions } from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL!, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions);
        console.log('MongoDB connected');
    } catch (error: any) {
        console.error(error);
        process.exit(1);
    }
}

export default connectDB;