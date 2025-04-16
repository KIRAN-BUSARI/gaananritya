import axiosInstance from '@/helper/axiosInstance';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('flex w-full flex-col space-y-2', className)}>
      {children}
    </div>
  );
};

const SignInCard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async () => {
    const res = await axiosInstance.post('/user/login', {
      ...data,
    });
    if (res.data.success === true) {
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      localStorage.setItem('accessToken', res.data.data.accessToken);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem(
        'isAdmin',
        res.data.data.user.role === 'ADMIN' ? 'true' : 'false',
      );
      navigate('/');
      window.location.reload();
    }
  };

  return (
    <div className="relative flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="flex w-1/4 flex-col rounded-md bg-[#f5f5f5] p-10 shadow-md">
        <LabelInputContainer>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="example@gmail.com"
            type="text"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="********"
            type="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </LabelInputContainer>
        <button
          className="group/btn relative mt-6 block h-10 w-full rounded-md bg-secondary font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
          onClick={handleSubmit}
        >
          Sign in &rarr;
          <BottomGradient />
        </button>
      </div>
    </div>
  );
};

export default SignInCard;
