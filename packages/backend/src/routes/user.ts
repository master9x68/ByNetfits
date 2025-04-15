// packages/backend/src/routes/user.ts
import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

// Placeholder: Lấy profile user (cần implement middleware auth và logic DB sau)
router.get('/profile', (req: Request, res: Response) => {
    // Tạm thời trả về dữ liệu giả
    // const userId = req.user?.id; // Giả sử middleware auth thêm thông tin user vào req
    res.status(200).json({
        address: '0x123...abc', // Địa chỉ ví giả
        username: 'temp_user',
        bio: 'This is a temporary bio.',
        avatar_url: null
    });
});

export default router;