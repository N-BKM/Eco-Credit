-- Seed Campus Admin Profile (Admin ID: ADMIN-2026-001)
-- Default password: admin@ecocredit2026
INSERT INTO public.profiles (id, full_name, student_id, department, year_of_study, role, avatar_url) VALUES
('00000000-0000-0000-0000-000000000001', 'Chief Campus Administrator', 'ADMIN-2026-001', 'Campus Facilities & Environment', 'Staff Administration', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80')
ON CONFLICT (student_id) DO NOTHING;

-- Seed Bins across Campus
INSERT INTO public.bins (label, location_name, category, latitude, longitude, qr_code, fill_percentage) VALUES
('RB-01', 'Block A Main Entrance', 'Recyclable', 12.9716, 77.5946, 'BIN-RB01-BLOCKA', 45),
('RB-04', 'Central Canteen Food Court', 'Organic', 12.9720, 77.5950, 'BIN-RB04-CANTEEN', 85),
('RB-07', 'University Library Lobby', 'Paper', 12.9712, 77.5940, 'BIN-RB07-LIBRARY', 30),
('EB-02', 'Engineering Block 3 - Lab 2', 'E-Waste', 12.9725, 77.5955, 'BIN-EB02-ENGLAB', 60),
('GB-05', 'Science Quadrangle Courtyard', 'Glass', 12.9718, 77.5948, 'BIN-GB05-SCIENCE', 25),
('MB-09', 'Student Activity Center', 'All', 12.9722, 77.5952, 'BIN-MB09-SACENTER', 70)
ON CONFLICT (qr_code) DO NOTHING;

-- Seed Campus Rewards
INSERT INTO public.rewards (name, description, cost_credits, category, image_url) VALUES
('Campus Canteen 20% Discount Voucher', 'Valid for any lunch or snack order at Central Canteen food court', 100, 'Food & Dining', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80'),
('Library Printing Credits (50 Pages)', 'Free high-quality B&W and color printouts at Central Library', 50, 'Academic', 'https://images.unsplash.com/photo-1568667256549-094345857637?w=500&q=80'),
('Eco-Friendly Stainless Water Bottle', 'Limited edition campus branded insulated stainless steel flask', 300, 'Merchandise', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80'),
('Organic Campus Coffee Pass (3 Cups)', 'Redeemable at Campus Roastery Coffee Shop', 120, 'Food & Dining', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80'),
('Campus Gym Priority Locker Access', '1-month reserved locker reservation at University Gym', 200, 'Campus Services', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80')
ON CONFLICT DO NOTHING;
