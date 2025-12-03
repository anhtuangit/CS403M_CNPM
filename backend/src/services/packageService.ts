import Package from '../models/Package';

const DEFAULT_PACKAGES = [
  {
    name: 'Starter 3 tin',
    slug: 'starter-3',
    price: 199000,
    listingCredits: 3,
    description: 'Thêm 3 lượt đăng, hiển thị thường',
    isActive: true
  },
  {
    name: 'Pro 5 tin',
    slug: 'pro-5',
    price: 299000,
    listingCredits: 5,
    description: 'Thêm 5 lượt đăng + ưu tiên xét duyệt',
    isActive: true
  }
];

export const ensureDefaultPackages = async () => {
  await Promise.all(
    DEFAULT_PACKAGES.map((pkg) =>
      Package.findOneAndUpdate({ slug: pkg.slug }, { $set: pkg }, { new: true, upsert: true })
    )
  );
};

export const listActivePackages = () => {
  return Package.find({ isActive: true }).sort({ listingCredits: 1 });
};

