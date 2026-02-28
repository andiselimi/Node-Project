import Field from "./field.model.js";

export const createField = async(req, res) =>{
    try {
        const{name, sports, dimensions, pricePerHour, surface} = req.body;

        const field = new Field({
            name: name,
            sports,
            dimensions,
            pricePerHour,
            surface,
            image,
        })

        await field.save();
        res.status(201).json({
            message: "Field Created",
            field,
            success: true,
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Error creating Field",
            error,
            success: false,
        })
    }
}

export const getAllFields = async(req, res) => {
    try {
        const name = req.query.name;
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const sport = req.query.sport;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = { isActive: true };
        if (name) {
            query.name = { $regex: name, $options: "i" };
        }

        if (minPrice) {
            query.pricePerHour = {$gte: minPrice};
        }else if (maxPrice) {
            query.pricePerHour = {$gte: maxPrice};
        }else if( minPrice && maxPrice){
            query.pricePerHour = {$gte: minPrice, $lte: maxPrice};
        }else if(sport){
            query.sports = {$in: sport};
        }

        const fields = await Field.find(query)
        .sort({
            createdAt: -1,
        })
        .skip(skip)
        .limit(limit);

        const totalDocuments = await Field.countDocuments(query);
        
        res.status(200).json({
            message: "Fields retrieved successfully",
            length: fields.length,
            totalDocuments,
            success: true,
            data: fields,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            error: error.message,
            success: false,
        });
    }
}

export const getOneField = async (req, res) => {
    try{
        const fieldId = req.params.fieldId;
        const field = await Field.findById(fieldId);
        if(!field){
                return res.status(404).json({
                    message: "field not found",
                });
            }else{
                res.status(200).json({
                    success: true,
                    data: field,
                })
            }
        } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error,
        })
    }
}

export const editField = async (req, res) => {
    try {
        const fieldId = req.params.fieldId;
        const{name, sports, dimensions, pricePerHour, surface, image} = req.body; 
        const field = await Field.findById(fieldId);

        if(!field){
            return res.status(404).json({
                message: "field not found",
            })
        }

        if(name){
            field.name = name
        }
        if(sports){
            field.sports = sports
        }
        if(dimensions){
            field.dimensions = dimensions
        }
        if(pricePerHour){
            field.pricePerHour = pricePerHour
        }
        if(surface){
            field.surface = surface
        }
        if(image){
            field.image = image
        }

        await field.save();
        res.status(200).json({
            success: true,
            message: "field editd",
            data: field,
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error,
        })
    }
}

export const deleteField = async (req, res) => {
    try {
        const fieldId = req.params.fieldId;
        await Field.findByIdAndUpdate(fieldId, {isActive: false});

        res.status(200).json({
            message: "Field deleted successfully",
            success: true,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message,
            success: false,
        })
    }
}

export const addReview = async (req, res) => {
    try {
        const fieldId = req.params.fieldId;
        const user = req.user._id;
        const comment = req.body.comment;
        const rating = req.body.rating;

        const field = await Field.findById(fieldId);
        if(!field){
            return res.status(404).json({
                message: "Field not found",
                success: false,
            });
        }

        const existingReview = field.reviews.find(
            (rev) => rev.user.toString() === user.toString()
        );

        if(existingReview){
            return res.status(400).json({
                message: "You have already reviewed this field",
                success: false,
            });
        }

        const newReview = {
            user: user,
            comment: comment,
            rating: rating,
        };

        field.reviews.push(newReview);

        const totalRating = field.reviews.reduce((acc, rev) => acc + rev.rating, 0);
        const averageRating = totalRating / field.reviews.length;

        field.averageRating = averageRating;

        await field.save();
        
        res.status(201).json({
            message: "Review added successfully",
            success: true,
            data: field,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            error: error,
            success: false,
        })
    }
}