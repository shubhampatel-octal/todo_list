export interface ITodos {
  _id: string;
  title: string;
  chacked: boolean;
}

export interface LocationFormValues {
  _id?: string;
  address: string;
  state: string;
  city: string;
  country: string;
  pincode: string;
}

export interface ILocation {
  _id: string;
  address: string;
  state: string;
  city: string;
  country: string;
  pincode: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBusiness {
  _id: string;
  name: string;
  ownerName: string;
  phoneNumber: string;
  email: string;
  imgLink: string;
  locations: ILocation[];
  userId: string;
}
