import { useState } from 'react';
import Modal from 'react-modal';
import Button from './ui/Button';
import Input from './ui/Input';
import { LocationFormValues } from '../type';
import { useAuth } from '../context';

interface ModalProps {
  itsNewBiz?: boolean;
  itsEdit?: boolean;
  setItsEdit?: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  businessId?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: LocationFormValues;
  setFormData: React.Dispatch<React.SetStateAction<LocationFormValues>>;
  setLocalAddressData?: React.Dispatch<React.SetStateAction<LocationFormValues[] | null>>;
}

const LocationModal = ({
  itsNewBiz = false,
  open,
  setOpen,
  businessId = '',
  formData,
  setFormData,
  itsEdit = false,
  setItsEdit,
  setLocalAddressData,
}: ModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setBusinessData } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const sendRequest = async () => {
    const reqData: RequestInit = {
      method: itsEdit ? 'PUT' : 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: formData.address.trim(),
        state: formData.state.trim(),
        city: formData.city.trim(),
        country: formData.country.trim(),
        pincode: formData.pincode.trim(),
        businessId,
        locationId: itsEdit ? formData?._id : null,
      }),
    };

    const res = await fetch('http://localhost:3000/business/location', reqData);
    const result = await res.json();

    if (res.status !== 200) return alert(result.msg);

    setBusinessData((prev) => {
      if (prev) {
        return prev.map((business) => {
          if (business._id === businessId) {
            return result.business;
          }
          return business;
        });
      }
      return null;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (itsNewBiz) {
        console.log(formData);
        console.log(setLocalAddressData);
        if (setLocalAddressData) {
          console.log(formData);
          setLocalAddressData((prev) => [...(prev || []), formData]);
        }
      } else {
        await sendRequest();
      }

      setOpen(false);
      if (setItsEdit) setItsEdit(false);
      setFormData({
        address: '',
        state: '',
        city: '',
        country: '',
        pincode: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (setItsEdit) setItsEdit(false);
    setFormData({
      address: '',
      state: '',
      city: '',
      country: '',
      pincode: '',
    });
    setOpen(false);
  };

  return (
    <Modal className="flex h-screen w-screen items-center justify-center bg-black/80" isOpen={open}>
      <div className="mx-auto w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">
          {itsEdit ? 'Edit' : 'Add'} Locations
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="address" className="mb-1 block text-sm font-medium text-gray-700">
              Address:
            </label>
            <Input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="state" className="mb-1 block text-sm font-medium text-gray-700">
                State:
              </label>
              <Input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                required
              />
            </div>
            <div>
              <label htmlFor="city" className="mb-1 block text-sm font-medium text-gray-700">
                City:
              </label>
              <Input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="country" className="mb-1 block text-sm font-medium text-gray-700">
              Country:
            </label>
            <Input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country"
              required
            />
          </div>
          <div>
            <label htmlFor="pincode" className="mb-1 block text-sm font-medium text-gray-700">
              Pincode:
            </label>
            <Input
              type="number"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter pincode"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LocationModal;
