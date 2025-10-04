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

// File upload endpoint
app.post("/upload/certificate", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const walletAddress = formData.get('walletAddress') as string;
    const donationId = formData.get('donationId') as string;

    if (!file || !walletAddress) {
      return c.json({ error: "File and wallet address are required" }, 400);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." }, 400);
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return c.json({ error: "File size too large. Maximum size is 10MB." }, 400);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `donation-certificates/${walletAddress}/${timestamp}.${fileExtension}`;

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(fileBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('donation-certificates')
      .upload(fileName, uint8Array, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return c.json({ error: "Failed to upload file" }, 500);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('donation-certificates')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // Update donation record if donationId provided
    if (donationId) {
      const { error: updateError } = await supabase
        .from('donations')
        .update({ certificate_url: publicUrl })
        .eq('id', donationId);

      if (updateError) {
        console.error('Update error:', updateError);
        // Don't fail the upload if update fails
      }
    }

    return c.json({
      success: true,
      fileName: fileName,
      publicUrl: publicUrl,
      fileSize: file.size,
      fileType: file.type
    });

  } catch (error) {
    console.error('File upload error:', error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get file info
app.get("/upload/info/:fileName", async (c) => {
  try {
    const fileName = c.req.param('fileName');
    
    const { data, error } = await supabase.storage
      .from('donation-certificates')
      .list(fileName.split('/').slice(0, -1).join('/'), {
        search: fileName.split('/').pop()
      });

    if (error) {
      return c.json({ error: "File not found" }, 404);
    }

    if (data.length === 0) {
      return c.json({ error: "File not found" }, 404);
    }

    const fileInfo = data[0];
    const { data: urlData } = supabase.storage
      .from('donation-certificates')
      .getPublicUrl(fileName);

    return c.json({
      success: true,
      file: {
        name: fileInfo.name,
        size: fileInfo.metadata?.size,
        contentType: fileInfo.metadata?.mimetype,
        lastModified: fileInfo.updated_at,
        publicUrl: urlData.publicUrl
      }
    });

  } catch (error) {
    console.error('File info error:', error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Delete file
app.delete("/upload/:fileName", async (c) => {
  try {
    const fileName = c.req.param('fileName');
    
    const { error } = await supabase.storage
      .from('donation-certificates')
      .remove([fileName]);

    if (error) {
      return c.json({ error: "Failed to delete file" }, 500);
    }

    return c.json({ success: true, message: "File deleted successfully" });

  } catch (error) {
    console.error('File deletion error:', error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "upload" });
});

export default app;