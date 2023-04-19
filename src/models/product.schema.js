import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: ["true", "Please provide a product name"],
        trim: true,
        maxLength: [120, "Product name should not be max than 120 chars"]
    },
    price: {
        type: Number,
        required: ["true", "Please provide a product price"]
    },
    description: {
        type: String
    },
    photos: [
        {
            secure_url: {
                type: String,
                required: true
            }
        }
    ],
    stock: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    collectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection"
    }
}, {timestamps: true})

export default mongoose.model("Produt", productSchema)