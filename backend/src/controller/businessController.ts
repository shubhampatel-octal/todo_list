import { Request, Response } from "express";
import { Business } from "../models/businessModel";
import Location, { ILocation } from "../models/locationsModel";

interface AuthRequest extends Request {
  userId: string;
}

const getBusiness = async (req: Request, res: Response) => {
  try {
    const data = await Business.aggregate([
      {
        $lookup: {
          from: "businesses",
          localField: "_id",
          foreignField: "userId",
          as: "businesses",
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "locations",
          foreignField: "_id",
          as: "locations",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          ownerName: 1,
          phoneNumber: 1,
          email: 1,
          imgLink: 1,
          locations: 1,
          userId: 1,
        },
      },
    ]);

    res.status(200).json(data);
  } catch (err) {
    console.log("Error Getting data");
    console.log(err);
    res.status(500).json({ msg: "Error Getting Data" });
  }
};

const createBusiness = async (req: Request, res: Response) => {
  try {
    const { name, email, ownerName, phoneNumber, locations } = req.body;
    const { userId } = req as AuthRequest;

    if (!req.file) {
      res.status(400).json({ message: "No file uploaded!" });
      return;
    }

    if (!name || !ownerName || !email || !phoneNumber) {
      res
        .status(403)
        .json({ msg: "name and ownerName and phoneNumber are required" });
      return;
    }

    const locationObjs = JSON.parse(locations || "[]");
    const createdLocations = await Location.insertMany(
      locationObjs?.map((loc: ILocation) => ({ ...loc, userId }))
    );
    const locationIds = createdLocations.map((loc) => loc._id);

    const newBusiness = {
      userId,
      name,
      ownerName,
      phoneNumber,
      email: req.body.email,
      imgLink: "http://localhost:3000/public/image/" + req.file.filename,
      locations: locationIds ? locationIds : [],
    };

    const business = await (
      await Business.create(newBusiness)
    ).populate("locations");

    res.status(200).json({ msg: "Business added successfully", business });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error Adding Business" });
  }
};

const updateBusiness = async (req: Request, res: Response) => {
  try {
    const { name, email, ownerName, phoneNumber, locations, businessId } =
      req.body;
    const { userId } = req as AuthRequest;
    console.log(req.body);

    if (!name || !ownerName || !email || !phoneNumber) {
      res
        .status(403)
        .json({ msg: "name and ownerName and phoneNumber are required" });
      return;
    }

    const newBusiness = {
      userId,
      name,
      ownerName,
      phoneNumber,
      email: req.body.email,
      ...(req.file
        ? { imgLink: "http://localhost:3000/public/image/" + req.file.filename }
        : {}),
    };

    const business = await Business.findByIdAndUpdate(businessId, newBusiness, {
      new: true,
    }).populate("locations");

    res.status(200).json({ msg: "Business added successfully", business });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error Updating Business" });
  }
};

const deleteBusiness = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.body;
    const { userId } = req as AuthRequest;

    if (!businessId) {
      res.status(400).json({ msg: "Business id is required" });
      return;
    }

    const businessExist = await Business.findById(businessId);

    if (!businessExist) {
      res.status(404).json({ msg: "Business not found" });
      return;
    }

    if (businessExist.userId.toString() !== userId) {
      res
        .status(403)
        .json({ msg: "use have no access to delete this Business" });
      return;
    }

    await Location.deleteMany({ _id: { $in: businessExist.locations } });

    await Business.findByIdAndDelete(businessId);
    res.status(200).json({ msg: "Business deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error Deleting Business" });
  }
};

const addLocation = async (req: Request, res: Response) => {
  try {
    const { userId } = req as AuthRequest;
    const { address, state, city, country, pincode, businessId } = req.body;
    if (
      address === "" ||
      state === "" ||
      city === "" ||
      country === "" ||
      pincode === ""
    )
      return void res.status(400).json({ msg: "All fields are required" });

    const location = await Location.create({
      userId,
      address,
      state,
      city,
      country,
      pincode,
    });

    if (!location)
      return void res.status(500).json({ msg: "Error Adding Location" });

    const business = await Business.findByIdAndUpdate(
      businessId,
      { $push: { locations: location._id } },
      { new: true }
    ).populate("locations");

    res
      .status(200)
      .json({ msg: "Location added successfully", location, business });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error Adding Location" });
  }
};

const editLocation = async (req: Request, res: Response) => {
  try {
    const { userId } = req as AuthRequest;
    const { address, state, city, country, pincode, businessId, locationId } =
      req.body;

    if (!locationId || locationId === "")
      return void res.status(400).json({ msg: "Location id is required" });

    if (!businessId || businessId === "")
      return void res.status(400).json({ msg: "Business id is required" });

    const location = await Location.findById(locationId);
    const businessExits = await Business.findById(businessId);

    if (!location)
      return void res.status(500).json({ msg: "Error Adding Location" });

    if (!businessExits)
      return void res.status(500).json({ msg: "Error Adding Business" });

    if (
      location?.userId?.toString() !== userId &&
      businessExits?.userId?.toString() !== userId
    )
      return void res
        .status(403)
        .json({ msg: "use have no access to edit this Location" });

    if (
      address === "" ||
      state === "" ||
      city === "" ||
      country === "" ||
      pincode === ""
    )
      return void res.status(400).json({ msg: "All fields are required" });

    location.address = address;
    location.state = state;
    location.city = city;
    location.country = country;
    location.pincode = pincode;
    await location.save();

    const business = await Business.findById(businessId).populate("locations");

    res.status(200).json({
      msg: "Location added successfully",
      location,
      business,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error Updating Location" });
  }
};

const deleteLocation = async (req: Request, res: Response) => {
  try {
    const { businessId, locationId } = req.body;
    const { userId } = req as AuthRequest;
    await Location.findByIdAndDelete(locationId);

    if (!locationId) {
      res.status(400).json({ msg: "Location id is required" });
      return;
    }
    const businessExist = await Business.findById(businessId);

    if (!businessExist) {
      res.status(404).json({ msg: "Business not found" });
      return;
    }

    if (businessExist.userId.toString() !== userId) {
      res
        .status(403)
        .json({ msg: "use have no access to delete this Location" });
      return;
    }

    await Location.findByIdAndDelete(locationId);

    await Business.findByIdAndUpdate(businessId, {
      $pull: { locations: locationId },
    });

    const business = await Business.findById(businessId).populate("locations");

    res.status(200).json({ msg: "Location deleted successfully", business });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error Deleting Location" });
  }
};

export {
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  addLocation,
  editLocation,
  deleteLocation,
};
