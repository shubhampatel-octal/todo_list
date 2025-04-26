import { useCallback, useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import Button from './ui/Button';
import Input from './ui/Input';
import LocationModal from './LocationModal';
import { IBusiness, LocationFormValues } from '../type';
import { useAuth } from '../context';
import { toast } from 'react-toastify';

interface ModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setBusinessData: React.Dispatch<React.SetStateAction<IBusiness[] | null>>;
  businessToEdit?: IBusiness | null;
  setIsEdit?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface BusinessFormValues {
  name: string;
  phoneNumber: string;
  image: File | null;
}

const BusinessModel = ({
  open,
  setOpen,
  setBusinessData,
  businessToEdit,
  setIsEdit,
}: ModalProps) => {
  const [formData, setFormData] = useState<BusinessFormValues>({
    name: '',
    phoneNumber: '',
    image: null,
  });
  const [locationFormData, setLocationFormData] = useState<LocationFormValues>({
    address: '',
    state: '',
    city: '',
    country: '',
    pincode: '',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const [localAddressData, setLocalAddressData] = useState<LocationFormValues[] | null>([]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      phoneNumber: '',
      image: null,
    });
    if (setIsEdit) setIsEdit(false);
    setLocalAddressData([]);
    setPreviewImage(null);
  }, [setIsEdit]);

  useEffect(() => {
    if (businessToEdit) {
      setFormData({
        name: businessToEdit.name,
        phoneNumber: businessToEdit.phoneNumber,
        image: null,
      });
      setPreviewImage(businessToEdit.imgLink || null);
      setLocalAddressData(businessToEdit.locations || []);
    } else {
      resetForm();
    }
  }, [businessToEdit, open, resetForm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });

      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('phoneNumber', formData.phoneNumber);
      form.append('ownerName', user?.username || '');
      form.append('email', user?.email || '');
      if (formData.image) {
        form.append('image', formData.image);
      }
      if (!businessToEdit && localAddressData) {
        form.append('locations', JSON.stringify(localAddressData));
      }

      if (businessToEdit) {
        form.append('businessId', businessToEdit._id);
      }

      const reqData: RequestInit = {
        method: businessToEdit ? 'PUT' : 'POST',
        credentials: 'include',
        body: form,
      };

      const response = await fetch('http://localhost:3000/business', reqData);

      const result = await response.json();

      if (response.status !== 200) return toast.error(result.message);

      if (businessToEdit) {
        setBusinessData(
          (prev) =>
            prev?.map((biz) => (biz._id === result.business._id ? result.business : biz)) || []
        );
      } else {
        setBusinessData((prev) => [...(prev || []), result.business]);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <>
      <Modal
        className="flex h-screen w-screen items-center justify-center bg-black/80"
        isOpen={open}
      >
        <div className="mx-auto max-h-screen w-full max-w-md overflow-auto scroll-auto rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Create Business</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="">
              <div className="flex w-full cursor-pointer items-center justify-center">
                <img
                  src={
                    previewImage
                      ? previewImage
                      : 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg'
                  }
                  alt="Business"
                  className="mt-2 h-40 w-40 rounded-lg object-cover"
                  onClick={() => fileInputRef.current?.click()}
                />
                <input
                  type="file"
                  className="hidden"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                  ref={fileInputRef}
                />
              </div>
            </div>
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                Name:
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Business name"
                required
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="mb-1 block text-sm font-medium text-gray-700">
                Phone Number:
              </label>
              <Input
                type="number"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter Business Phone Number"
                required
              />
            </div>
            <div className="h-full max-h-56 overflow-auto scroll-auto">
              {localAddressData &&
                localAddressData.map((address, index) => (
                  <div>
                    <label
                      htmlFor="address"
                      className="mb-1 block border-b border-gray-200 text-sm font-medium text-gray-700"
                    >
                      {`Address ${index + 1}: ${address.address}, ${address.city}, ${address.state}, ${address.country}, ${address.pincode}`}
                    </label>
                  </div>
                ))}
            </div>
            {!businessToEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocationOpen(true)}
                disabled={isSubmitting}
                className="w-full"
              >
                Add Location
              </Button>
            )}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      <LocationModal
        open={locationOpen}
        setOpen={setLocationOpen}
        formData={locationFormData}
        setFormData={setLocationFormData}
        setLocalAddressData={setLocalAddressData}
        itsNewBiz={true}
      />
    </>
  );
};

export default BusinessModel;
