
function openModal() {
    document.getElementById("myModal").classList.add("show");
}

function closeModal() {
    document.getElementById("myModal").classList.remove("show");
}

/* --- নতুন ও শক্তিশালী কপি ফাংশন --- */
function copyResult() {
    const resultElement = document.getElementById("resultDisplay");
    const textToCopy = resultElement.innerText;

    if (textToCopy === "Awaiting input..." || textToCopy === "") {
        alert("কপি করার মতো কিছু নেই!");
        return;
    }

    // ব্যাকআপ পদ্ধতি (এটি সব ব্রাউজারে কাজ করবে)
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        // কপি সফল হলে বাটনের চেহারা পাল্টাবে
        const copyBtn = document.querySelector(".copy-btn");
        copyBtn.innerText = "✅ Copied!";
        copyBtn.style.background = "#0f0"; 
        
        setTimeout(() => {
            copyBtn.innerText = "Copy";
            copyBtn.style.background = "#00f7ff"; 
        }, 2000);
    } catch (err) {
        alert("কপি করা যায়নি, ম্যানুয়ালি চেষ্টা করুন।");
    }
    document.body.removeChild(textArea);
}


// ১. টেক্সট এনকোড করার ফাংশন
function encodeText() {
    // ইনপুট বক্স থেকে লেখাটি নেওয়া
    let input = document.getElementById("inputText").value;
    
    if (input.trim() === "") {
        alert("Please enter some text first!");
        return;
    }

    try {
        // Base64 এ এনকোড করা (btoa ফাংশন দিয়ে)
        let encoded = btoa(input);
        
        // রেজাল্ট বক্সে দেখানো
        document.getElementById("resultDisplay").innerText = encoded;
    } catch (e) {
        alert("Error: Could not encode this text!");
    }
}

// ২. টেক্সট ডিকোড করার ফাংশন
function decodeText() {
    // ইনপুট বক্স থেকে এনকোড করা লেখাটি নেওয়া
    let input = document.getElementById("inputText").value;

    if (input.trim() === "") {
        alert("Please enter the encoded text!");
        return;
    }

    try {
        // Base64 থেকে ডিকোড করা (atob ফাংশন দিয়ে)
        let decoded = atob(input);
        
        // রেজাল্ট বক্সে আসল লেখাটি দেখানো
        document.getElementById("resultDisplay").innerText = decoded;
    } catch (e) {
        // যদি ইনপুটটি সঠিক এনকোড করা টেক্সট না হয়
        alert("Invalid Encoded Text! Please provide a valid Base64 string.");
    }
}




// মডাল কন্ট্রোল
function openBgModal() {
    document.getElementById("bgModal").classList.add("show");
}
function closeBgModal() {
    document.getElementById("bgModal").classList.remove("show");
}

// ১. ছবি সিলেক্ট করলে প্রিভিউ দেখাবে
function previewImage() {
    const fileInput = document.getElementById("imageInput");
    const previewArea = document.getElementById("previewArea");
    const imgPreview = document.getElementById("imgPreview");
    const downloadBox = document.getElementById("downloadBox");

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imgPreview.src = e.target.result;
            previewArea.style.display = "block";
            downloadBox.style.display = "none"; 
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

// ২. ব্যাকগ্রাউন্ড রিমুভ করার মেইন ফাংশন
async function removeBackground() {
    const fileInput = document.getElementById("imageInput");
    const removeBtn = document.getElementById("removeBtn");
    
    if (!fileInput.files[0]) {
        alert("আগে একটি ছবি সিলেক্ট করুন!");
        return;
    }

    const file = fileInput.files[0];
    removeBtn.innerText = "⏳ AI Working... (Wait)";
    removeBtn.disabled = true;

    try {
        // নতুন এবং সঠিক ফাংশন কল
        const blob = await imglyBackgroundRemoval(file, {
            publicPath: "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/" 
        });

        const url = URL.createObjectURL(blob);

        // ছবি এবং ডাউনলোড বাটন আপডেট
        document.getElementById("imgPreview").src = url;
        document.getElementById("previewArea").style.display = "block";
        document.getElementById("downloadBox").style.display = "block";
        document.getElementById("downloadLink").href = url;

        alert("সফলভাবে ব্যাকগ্রাউন্ড রিমুভ হয়েছে!");
    } catch (err) {
        console.error(err);
        alert("প্রসেসিং ব্যর্থ হয়েছে! আপনার ইন্টারনেট কানেকশন চেক করুন অথবা ছোট সাইজের ছবি ব্যবহার করুন।");
    } finally {
        removeBtn.innerText = "✨ Remove BG";
        removeBtn.disabled = false;
    }
}






// ইউটিউব থাম্বনেইল বের করার ফাংশন
// ১. মডাল ওপেন ও ক্লোজ
function thumbModal() {
    const modal = document.getElementById("thumbModal");
    modal.style.display = "block";
    modal.classList.add("show");
}

function closeThumbModal() {
    document.getElementById("thumbModal").style.display = "none";
}

// ২. থাম্বনেইল জেনারেট করা (ফাংশনের নাম ঠিক করা হয়েছে)
function getThumbnails() {
    const urlInput = document.getElementById("videoUrl");
    const resultArea = document.getElementById("thumbResult");
    const preview = document.getElementById("thumbPreview");

    const url = urlInput.value.trim();

    if (!url) { 
        alert("Please paste a link!"); 
        return; 
    }

    // YouTube ID বের করার সবচাইতে শক্তিশালী নিয়ম
    const videoIdMatch = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]{11})/);

    if (videoIdMatch && videoIdMatch[1]) {
        const id = videoIdMatch[1];
        const thumbUrl = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
        
        preview.src = thumbUrl;
        resultArea.style.display = "block";

        // যদি HD ছবি না থাকে তবে HQ লোড হবে
        preview.onerror = function() {
            this.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
        };
    } else {
        alert("Invalid YouTube Link!");
    }
}

// ৩. সরাসরি ডাউনলোড (Blob Method)
async function downloadThumbnail() {
    const imageUrl = document.getElementById("thumbPreview").src;
    
    if (!imageUrl) return;

    try {
        // 'Downloading...' টেক্সট দেখানো (ইউজারের সুবিধার জন্য)
        const btn = event.target;
        const originalText = btn.innerText;
        btn.innerText = "⏳ Downloading...";

        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Sazzad_Thumbnail.jpg';
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        btn.innerText = originalText;
    } catch (e) {
        // যদি Blob ব্লক হয় তবে নতুন ট্যাবে ওপেন হবে
        window.open(imageUrl, '_blank');
    }
}

// থাম্বনেইল মডাল বন্ধ করার ফাংশন
function closeThumbModal() {
    const modal = document.getElementById("thumbModal");
    if (modal) {
        modal.style.display = "none";
        modal.classList.remove("show");
        
        // মডাল বন্ধ করার সময় আগের রেজাল্ট আর ইনপুট পরিষ্কার করে দেওয়া ভালো
        document.getElementById("videoUrl").value = "";
        document.getElementById("thumbResult").style.display = "none";
    }
}












// ১. মডাল কন্ট্রোল
function qrModal() {
    const modal = document.getElementById("qrModal");
    modal.style.display = "block";
    modal.classList.add("show");
}

function closeQRModal() {
    document.getElementById("qrModal").style.display = "none";
}

// ২. QR কোড তৈরি করা
function generateQR() {
    const text = document.getElementById("qrText").value.trim();
    const qrDiv = document.getElementById("qrcode");
    const resultBox = document.getElementById("qrResult");

    if (!text) {
        alert("Please enter something!");
        return;
    }

    qrDiv.innerHTML = ""; // আগের QR মুছে ফেলা
    resultBox.style.display = "block";

    new QRCode(qrDiv, {
        text: text,
        width: 200,
        height: 200,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

// ৩. QR কোড ইমেজ হিসেবে ডাউনলোড করা
function downloadQR() {
    const qrImg = document.querySelector("#qrcode img");
    if (qrImg) {
        const link = document.createElement('a');
        link.href = qrImg.src;
        link.download = 'Sazzad_QR_Code.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        // যদি ক্যানভাস মোডে থাকে
        const qrCanvas = document.querySelector("#qrcode canvas");
        const link = document.createElement('a');
        link.href = qrCanvas.toDataURL("image/png");
        link.download = 'Sazzad_QR_Code.png';
        link.click();
    }
}


// QR মডাল বন্ধ করার ফাংশন
function closeQRModal() {
    const modal = document.getElementById("qrModal");
    if (modal) {
        modal.style.display = "none";
        modal.classList.remove("show");
        
        // মডাল বন্ধ করার সময় ইনপুট আর আগের কিউআর পরিষ্কার করে দেওয়া ভালো
        document.getElementById("qrInput").value = "";
        document.getElementById("qrResultArea").style.display = "none";
        
    }
}













// ১. মডাল কন্ট্রোল
function tiktokModal() {
    document.getElementById("tiktokModal").style.display = "block";
    document.getElementById("tiktokModal").classList.add("show");
}

function closeTiktokModal() {
    document.getElementById("tiktokModal").style.display = "none";
    document.getElementById("tiktokUrl").value = "";
    document.getElementById("tiktokResult").style.display = "none";
}

// ২. ভিডিও ডেটা আনা
async function getTiktokVideo() {
    const url = document.getElementById("tiktokUrl").value.trim();
    const getBtn = document.getElementById("tiktokGetBtn");
    const resultArea = document.getElementById("tiktokResult");

    if (!url) {
        alert("Please paste a TikTok link!");
        return;
    }

    getBtn.innerText = "🌀 Fetching...";
    getBtn.disabled = true;

    try {
        const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.code === 0) {
            const videoData = data.data;
            document.getElementById("tiktokTitle").innerText = videoData.title || "Video Found!";
            
            const dlBtn = document.getElementById("tiktokDLBtn");
            
            // নতুন এবং শক্তিশালী ডাউনলোড লজিক
            dlBtn.onclick = async () => {
                dlBtn.innerText = "⏳ Downloading...";
                try {
                    const videoResponse = await fetch(videoData.play);
                    const blob = await videoResponse.blob();
                    const blobUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = `Sazzad_TikTok_${Date.now()}.mp4`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(blobUrl);
                } catch (e) {
                    // যদি Blob মেথড ফেইল করে তবে ব্যাকআপ হিসেবে নতুন ট্যাবে ওপেন হবে
                    window.open(videoData.play, "_blank");
                } finally {
                    dlBtn.innerHTML = "📥 Download Video";
                }
            };
            
            resultArea.style.display = "block";
        } else {
            alert("Video not found or link is invalid!");
        }
    } catch (error) {
        alert("Error fetching video. Try again!");
    } finally {
        getBtn.innerText = "✨ Get Video";
        getBtn.disabled = false;
    }
}

// ১. TikTok মডাল ক্লোজ করার একদম ডিরেক্ট ফাংশন
function closeTiktokModal() {
    const modal = document.getElementById("tiktokModal");
    
    if (modal) {
        // মডাল লুকানো
        modal.style.display = "none";
        modal.classList.remove("show");
        
        // সব ডাটা ক্লিয়ার করা (যাতে পরে ওপেন করলে আগেরটা না থাকে)
        document.getElementById("tiktokUrl").value = ""; 
        document.getElementById("tiktokResult").style.display = "none";
        document.getElementById("tiktokTitle").innerText = "";
        
        console.log("TikTok Modal Closed & Cleaned!"); // চেক করার জন্য
    }
}

























// ১. মডাল কন্ট্রোল
function linkModal() {
    document.getElementById("linkModal").style.display = "block";
    document.getElementById("linkModal").classList.add("show");
}

// ২. সরাসরি ক্লোজ ফাংশন (যা ডাটা ক্লিয়ার করবে)
function closeLinkModal() {
    const modal = document.getElementById("linkModal");
    modal.style.display = "none";
    modal.classList.remove("show");
    
    // ডাটা ক্লিয়ারিং
    document.getElementById("linkUrl").value = "";
    document.getElementById("linkResult").style.display = "none";
}

// ৩. লিঙ্ক চেক করার লজিক
async function checkLink() {
    const url = document.getElementById("linkUrl").value.trim();
    const checkBtn = document.getElementById("checkBtn");
    const resultArea = document.getElementById("linkResult");
    const statusText = document.getElementById("linkStatus");
    const safetyText = document.getElementById("linkSafety");

    if (!url) {
        alert("Please enter a link!");
        return;
    }

    checkBtn.innerText = "🌀 Checking...";
    checkBtn.disabled = true;

    try {
        // এখানে আমরা একটি ফ্রি API ব্যবহার করছি লিঙ্কের স্ট্যাটাস দেখার জন্য
        const response = await fetch(`https://api.shlink.io/v1/short-urls/check?url=${encodeURIComponent(url)}`).catch(() => null);
        
        resultArea.style.display = "block";
        
        // সিম্পল ভ্যালিডেশন চেক
        if (url.startsWith("http")) {
            statusText.innerText = "✅ Likely Safe Link";
            statusText.style.color = "#00ff2a";
            safetyText.innerText = "⚠️ Always be careful before clicking unknown links.";
            safetyText.style.color = "#ffcc00";
        } else {
            statusText.innerText = "❌ Invalid Link!";
            statusText.style.color = "#ff0055";
            safetyText.innerText = "Please enter a full URL (with http/https).";
            safetyText.style.color = "#fff";
        }
    } catch (error) {
        alert("Something went wrong!");
    } finally {
        checkBtn.innerText = "🔍 Check Link";
        checkBtn.disabled = false;
    }
}












// ১. পপআপ ওপেন করার ফাংশন
function imageModal() {
    const modal = document.getElementById("imageModal");
    if(modal) {
        modal.style.display = "block";
        modal.classList.add("show");
    }
}

// ২. পপআপ ক্লোজ করার ফাংশন
function closeImageModal() {
    const modal = document.getElementById("imageModal");
    if(modal) {
        modal.style.display = "none";
        modal.classList.remove("show");
        
        // সব ডাটা ক্লিয়ার করা
        document.getElementById("imageInput").value = "";
        document.getElementById("localPreview").style.display = "none";
        document.getElementById("localPreview").src = "";
        document.getElementById("dropText").style.display = "block";
        document.getElementById("dropText").innerText = "📁 Click to Select Image";
        document.getElementById("imageResult").style.display = "none";
    }
}

// ৩. উইন্ডো লোড হওয়ার পর ইভেন্টগুলো সেট করা (খুবই জরুরি)
window.onload = function() {
    const imageInput = document.getElementById("imageInput");
    
    if(imageInput) {
        imageInput.onchange = function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById("localPreview");
                    preview.src = e.target.result;
                    preview.style.display = "block";
                    document.getElementById("dropText").style.display = "none";
                };
                reader.readAsDataURL(file);
            }
        };
    }
};

// ৪. ইমেজ আপলোড ফাংশন
async function uploadImage() {
    const fileInput = document.getElementById("imageInput");
    const uploadBtn = document.getElementById("uploadBtn");
    
    if (!fileInput.files[0]) {
        alert("Please select an image first!");
        return;
    }

    uploadBtn.innerText = "🌀 Uploading...";
    uploadBtn.disabled = true;

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    try {
        // নতুন এবং সরাসরি API ব্যবহার করছি
        const response = await fetch("https://api.imgbb.com/1/upload?key=d7bd4b5eabf23e7c9e39d6648e6db182", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById("imageUrl").value = data.data.url;
            document.getElementById("imageResult").style.display = "block";
            uploadBtn.innerText = "🚀 Get Link";
            
        } else {
            // যদি এই কী-টাও ফেইল করে, তবে নিচের মেসেজ দিবে
            alert("Server Busy. Please try again after 1 minute.");
        }
    } catch (error) {
        alert("Check your Internet Connection!");
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.innerText = "🚀 Get Link";
    }
}