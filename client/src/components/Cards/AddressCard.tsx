type Address = {
  id: number;
  city: string;
  name: string;
  address: (string | JSX.Element)[];
  phoneNumber: string;
};

type AddressCardProps = {
  address: Address;
};

const AddressCard = ({ address }: AddressCardProps) => {
  return (
    <div className="flex w-full flex-col text-balance p-4 text-sm md:text-base">
      <h2 className="font-semibold capitalize text-secondary1">
        {address.city}
      </h2>
      <p className="mt-2 font-medium">{address.name} &reg;</p>
      <div className="mt-1">
        {Array.isArray(address.address) ? (
          address.address.map((line, idx) => <div key={idx}>{line}</div>)
        ) : (
          <p>{address.address}</p>
        )}
      </div>
      <p className="mt-1">Phone: {address.phoneNumber}</p>
    </div>
  );
};

export default AddressCard;
