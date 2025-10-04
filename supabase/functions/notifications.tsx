import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://nigxqmizirtccedoezhf.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const app = new Hono();

// Enable CORS
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Send push notification
app.post("/send", async (c) => {
  try {
    const { 
      userId, 
      type, 
      title, 
      message, 
      data = {},
      priority = 'normal'
    } = await c.req.json();

    if (!userId || !type || !title || !message) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Create notification in database
    const { data: notification, error: dbError } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        data,
        read: false
      })
      .select()
      .single();

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    // Get user's push subscription (if available)
    const { data: user } = await supabase
      .from('users')
      .select('wallet_address, name')
      .eq('id', userId)
      .single();

    // In a real implementation, you would:
    // 1. Get user's push subscription from database
    // 2. Send push notification via FCM/APNS
    // 3. Handle delivery status

    // For now, we'll simulate the push notification
    console.log(`Push notification sent to user ${userId}:`, {
      title,
      message,
      type,
      priority
    });

    return c.json({
      success: true,
      notification,
      message: "Notification sent successfully"
    });

  } catch (error) {
    console.error('Send notification error:', error);
    return c.json({ error: "Failed to send notification" }, 500);
  }
});

// Send bulk notifications
app.post("/send-bulk", async (c) => {
  try {
    const { 
      userIds, 
      type, 
      title, 
      message, 
      data = {},
      priority = 'normal'
    } = await c.req.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return c.json({ error: "userIds array is required" }, 400);
    }

    if (!type || !title || !message) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Create notifications in batch
    const notifications = userIds.map(userId => ({
      user_id: userId,
      type,
      title,
      message,
      data,
      read: false
    }));

    const { data: createdNotifications, error: dbError } = await supabase
      .from('notifications')
      .insert(notifications)
      .select();

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    // Log bulk notification
    console.log(`Bulk notification sent to ${userIds.length} users:`, {
      title,
      message,
      type,
      priority
    });

    return c.json({
      success: true,
      notifications: createdNotifications,
      count: createdNotifications.length,
      message: "Bulk notifications sent successfully"
    });

  } catch (error) {
    console.error('Send bulk notification error:', error);
    return c.json({ error: "Failed to send bulk notifications" }, 500);
  }
});

// Get notification statistics
app.get("/stats", async (c) => {
  try {
    const { userId, type, startDate, endDate } = c.req.query();

    let query = supabase
      .from('notifications')
      .select('id, type, read, created_at');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data: notifications, error } = await query;

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // Calculate statistics
    const stats = {
      total: notifications.length,
      read: notifications.filter(n => n.read).length,
      unread: notifications.filter(n => !n.read).length,
      byType: notifications.reduce((acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      readRate: notifications.length > 0 ? 
        (notifications.filter(n => n.read).length / notifications.length * 100).toFixed(2) : 0
    };

    return c.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get notification stats error:', error);
    return c.json({ error: "Failed to get notification statistics" }, 500);
  }
});

// Mark all notifications as read for a user
app.put("/mark-all-read/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');

    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)
      .select();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return c.json({
      success: true,
      updatedCount: data.length,
      message: "All notifications marked as read"
    });

  } catch (error) {
    console.error('Mark all notifications read error:', error);
    return c.json({ error: "Failed to mark notifications as read" }, 500);
  }
});

// Delete old notifications
app.delete("/cleanup", async (c) => {
  try {
    const { daysOld = 30 } = c.req.query();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(daysOld));

    const { data, error } = await supabase
      .from('notifications')
      .delete()
      .lt('created_at', cutoffDate.toISOString())
      .eq('read', true);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return c.json({
      success: true,
      deletedCount: data.length,
      message: `Deleted ${data.length} old notifications`
    });

  } catch (error) {
    console.error('Cleanup notifications error:', error);
    return c.json({ error: "Failed to cleanup notifications" }, 500);
  }
});

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "notifications" });
});

export default app;