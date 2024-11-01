document.addEventListener('DOMContentLoaded', () => {
    const outputElement = document.getElementById('console-output');
    const cursorElement = document.getElementById('cursor');
    const warningElement = document.getElementById('warning');

    const lines = [
        'get.systemdata',
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let typingSpeed = 50;
    let lineDelay = 1000;

    function typeLine() {
        if (charIndex < lines[lineIndex].length) {
            outputElement.textContent += lines[lineIndex][charIndex];
            charIndex++;
            setTimeout(typeLine, typingSpeed);
        } else {
            outputElement.textContent += '\n';
            charIndex = 0;
            lineIndex++;
            if (lineIndex === 1) {
                fetchData();
            } else {
                cursorElement.style.display = 'none';
                showWarning();
            }
        }
    }

    async function fetchData() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();

            const ipInfo = `
System Information:

[IP Information]
    IP Address: ${data.ip}
    Country: ${data.country_name}
    Region: ${data.region}
    City: ${data.city}
    Postal Code: ${data.postal}
    Latitude: ${data.latitude}
    Longitude: ${data.longitude}
    Timezone: ${data.timezone}
    ISP: ${data.org}
    Autonomous System: ${data.asn}

[Browser and Device Information]
    Browser Name: ${navigator.userAgentData ? navigator.userAgentData.brands[0].brand : 'Unknown'}
    Platform Name: ${navigator.platform}
    Browser Version: ${navigator.userAgentData ? navigator.userAgentData.brands[0].version : navigator.appVersion}
    Mobile/Tablet: ${navigator.userAgentData ? navigator.userAgentData.mobile : 'No'}
    Referrer: ${document.referrer || 'None'}

[System Languages]
    System Languages: ${navigator.languages.join(', ')}

[Screen Information]
    Screen Width: ${window.screen.width}
    Screen Height: ${window.screen.height}
    Window Width: ${window.innerWidth}
    Window Height: ${window.innerHeight}
    Display Pixel Depth: ${window.screen.pixelDepth}
    Screen Orientation: ${screen.orientation.type}
    Screen Rotation: ${screen.orientation.angle}

[CPU and GPU Information]
    CPU Threads: ${navigator.hardwareConcurrency}
    ${getGPUInfo()}
            `;
            displayData(ipInfo);
        } catch (error) {
            displayData('Error fetching IP data.');
        }
    }

    function getGPUInfo() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return 'GPU Info: Not available';

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown';
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';
        return `GPU Vendor: ${vendor}, GPU Info: ${renderer}`;
    }

    function displayData(data) {
        const lines = data.trim().split('\n');
        lines.forEach((line, index) => {
            setTimeout(() => {
                outputElement.textContent += line + '\n';
                if (index === lines.length - 1) {
                    cursorElement.style.display = 'none';
                    showWarning();
                }
            }, index * 100);
        });
    }

    function showWarning() {
        warningElement.style.opacity = '1';
    }

    setTimeout(() => {
        typeLine();
    }, 1000);
});
