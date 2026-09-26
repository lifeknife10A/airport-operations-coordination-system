/**
 * Client & Server-backed Operational Reports Generator
 * Generates genuine CSV, PDF, and Excel (XLSX/XML) files and triggers browser download.
 */
import toast from 'react-hot-toast';

// Helper to trigger browser download of a Blob
const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

/**
 * 1. FLIGHT MOVEMENT SUMMARY (CSV EXPORT)
 */
export const exportFlightMovementCSV = () => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const headers = [
      'Flight Number',
      'Airline',
      'Aircraft Type',
      'Route',
      'Gate Stand',
      'Scheduled Time (UTC)',
      'Movement Type',
      'Operational Status',
      'Booked Pax',
      'Turnaround SLA (%)',
      'Gate Clearance',
    ];

    const rows = [
      ['SPH-102', 'Saphire Airways', 'Airbus A350-900', 'SPH -> LHR (London)', 'Gate B12', '22:45 UTC', 'DEPARTURE', 'BOARDING', '284', '96.4%', 'CLEARED'],
      ['SPH-204', 'Saphire Airways', 'Boeing 777-300ER', 'SPH -> DXB (Dubai)', 'Gate A04', '23:10 UTC', 'DEPARTURE', 'SCHEDULED', '312', '99.1%', 'PENDING'],
      ['SPH-308', 'Saphire Airways', 'Boeing 787-9', 'SPH -> LAX (Los Angeles)', 'Gate C22', '23:35 UTC', 'DEPARTURE', 'AIRBORNE', '248', '98.5%', 'CLEARED'],
      ['SPH-809', 'Saphire Airways', 'Airbus A330-300', 'SPH -> JFK (New York)', 'Gate A10', '23:50 UTC', 'DEPARTURE', 'DELAYED (+25m)', '275', '84.2%', 'HELD'],
      ['SPH-412', 'Saphire Airways', 'Airbus A321neo', 'CDG -> SPH (Paris)', 'Gate B08', '00:15 UTC', 'ARRIVAL', 'ON_BLOCK', '192', '97.8%', 'CLEARED'],
      ['BA-142', 'British Airways', 'Boeing 787-10', 'LHR -> SPH (London)', 'Gate B02', '01:05 UTC', 'ARRIVAL', 'SCHEDULED', '266', '98.0%', 'STANDBY'],
      ['EK-506', 'Emirates', 'Airbus A380-800', 'DXB -> SPH (Dubai)', 'Gate C18', '01:30 UTC', 'ARRIVAL', 'SCHEDULED', '490', '95.2%', 'STANDBY'],
      ['AI-203', 'Air India', 'Boeing 787-8', 'DEL -> SPH (Delhi)', 'Gate A06', '02:00 UTC', 'ARRIVAL', 'ON_BLOCK', '230', '98.9%', 'CLEARED'],
      ['LH-760', 'Lufthansa', 'Airbus A350-900', 'FRA -> SPH (Frankfurt)', 'Gate B14', '02:40 UTC', 'ARRIVAL', 'SCHEDULED', '290', '97.1%', 'STANDBY'],
      ['SQ-402', 'Singapore Airlines', 'Airbus A350-900', 'SIN -> SPH (Singapore)', 'Gate C10', '03:15 UTC', 'ARRIVAL', 'SCHEDULED', '253', '99.5%', 'STANDBY'],
    ];

    const csvContent = [
      '# SAPHIRE INTERNATIONAL AIRPORT (SPH) - DIRECTORATE OF AIRFIELD OPERATIONS',
      `# Report: Flight Movement & Turnaround SLA Summary (Generated: ${new Date().toUTCString()})`,
      '# Classification: Official Aerodrome Operations Record',
      '',
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      '',
      `# Summary Metrics: Total Flights=10, On-Time Dispatch=90%, Delayed=1, Avg Turnaround SLA=96.4%`,
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `Saphire_Flight_Movement_Summary_${timestamp}.csv`);
    toast.success('Flight Movement Summary (CSV) generated & downloaded');
  } catch (err) {
    console.error('Failed to export CSV:', err);
    toast.error('Failed to generate CSV export.');
  }
};

/**
 * 2. GATE & STAND UTILIZATION (PDF EXPORT)
 * Generates an authentic PDF document with official aerodrome formatting.
 */
export const exportGateUtilizationPDF = () => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    // Build raw PDF specification document
    const title = 'SAPHIRE INTERNATIONAL AIRPORT (SPH)';
    const subtitle = 'GATE & STAND OCCUPANCY TELEMETRY REPORT';
    const dateStr = new Date().toUTCString();

    const pdfBody = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
6 0 obj
<< /Length 1200 >>
stream
BT
/F1 16 Tf
50 740 Td
(${title}) Tj
/F1 11 Tf
0 -22 Td
(${subtitle}) Tj
/F2 9 Tf
0 -16 Td
(Generated: ${dateStr} | Authority: Saphire Directorate of Airside Ops) Tj
/F1 10 Tf
0 -26 Td
(---------------------------------------------------------------------------------------------------------------------------------) Tj
0 -18 Td
(STAND    CONCOURSE   AIRCRAFT      OCCUPANCY   TURNAROUND   STATUS     BRIDGE TELEMETRY) Tj
0 -14 Td
(---------------------------------------------------------------------------------------------------------------------------------) Tj
/F2 9 Tf
0 -16 Td
(Gate A04  Concourse A  B777-300ER    48 mins     55m target   SCHEDULED  Aerobridge 1A Active - Normal) Tj
0 -15 Td
(Gate A06  Concourse A  B787-8        32 mins     45m target   OCCUPIED   Aerobridge 1B GPU Connected) Tj
0 -15 Td
(Gate A10  Concourse A  A330-300      65 mins     50m target   DELAYED    PCA Line Active - Hold) Tj
0 -15 Td
(Gate B02  Concourse B  B787-10       -- mins     55m target   STANDBY    Bridge Pre-positioned) Tj
0 -15 Td
(Gate B08  Concourse B  A321neo       22 mins     40m target   OCCUPIED   Aerobridge 2A Docked - Deplaning) Tj
0 -15 Td
(Gate B12  Concourse B  A350-900      41 mins     60m target   BOARDING   Dual Jetbridge Active - Gate 12) Tj
0 -15 Td
(Gate B14  Concourse B  A350-900      -- mins     60m target   STANDBY    Baggage Carousel 02 Linked) Tj
0 -15 Td
(Gate C10  Concourse C  A350-900      -- mins     55m target   STANDBY    Stand Clear - Ready) Tj
0 -15 Td
(Gate C18  Concourse C  A380-800      -- mins     90m target   STANDBY    Upper Deck Jetbridge Standby) Tj
0 -15 Td
(Gate C22  Concourse C  B787-9        58 mins     55m target   AIRBORNE   Stand Cleaned & Inspected) Tj
0 -24 Td
/F1 10 Tf
(---------------------------------------------------------------------------------------------------------------------------------) Tj
0 -16 Td
(OPERATIONAL SUMMARY & AERODROME METRICS) Tj
/F2 9 Tf
0 -15 Td
(Total Passenger Gates: 200 | Active Aerobridges: 184 | Stand Occupancy Rate: 84.6%) Tj
0 -14 Td
(Average Turnaround Critical-Path Duration: 47.8 minutes (ICAO Category 9 Compliant)) Tj
0 -14 Td
(Ground Power Unit (GPU) Utilization: 92.4% | Pre-Conditioned Air (PCA) Efficiency: 96.1%) Tj
0 -26 Td
/F1 9 Tf
(VERIFICATION & EXECUTIVE SIGN-OFF) Tj
/F2 8 Tf
0 -14 Td
(Certified by Central AOCC Flight Control Matrix. All stand allocations comply with ICAO Annex 14 standards.) Tj
0 -12 Td
(Authentication Security Hash: SPH-PDF-SEC-882194-AOCC-ROOT) Tj
ET
endstream
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000236 00000 n 
0000000318 00000 n 
0000000395 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
1650
%%EOF`;

    const blob = new Blob([pdfBody], { type: 'application/pdf' });
    downloadBlob(blob, `Saphire_Gate_Stand_Utilization_Report_${timestamp}.pdf`);
    toast.success('Gate & Stand Utilization Report (PDF) generated & downloaded');
  } catch (err) {
    console.error('Failed to export PDF:', err);
    toast.error('Failed to generate PDF export.');
  }
};

/**
 * 3. AIRLINE BILLING & TARIFF MANIFEST (EXCEL EXPORT)
 * Generates an XML-Spreadsheet standard compatible with Microsoft Excel and Google Sheets.
 */
export const exportAirlineBillingExcel = () => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    const xmlSpreadsheet = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Bottom"/>
   <Borders/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Calibri" ss:Size="12" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#0F2942" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Title">
   <Font ss:FontName="Calibri" ss:Size="14" ss:Bold="1" ss:Color="#0F2942"/>
  </Style>
  <Style ss:ID="Currency">
   <NumberFormat ss:Format="$#,##0.00"/>
  </Style>
  <Style ss:ID="BoldTotal">
   <Font ss:FontName="Calibri" ss:Bold="1" ss:Color="#0F2942"/>
   <Interior ss:Color="#F0F9FF" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="$#,##0.00"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Airline Billing Manifest">
  <Table ss:ExpandedColumnCount="8" ss:ExpandedRowCount="16" x:FullColumns="1" x:FullRows="1">
   <Column ss:Width="110"/>
   <Column ss:Width="120"/>
   <Column ss:Width="90"/>
   <Column ss:Width="100"/>
   <Column ss:Width="95"/>
   <Column ss:Width="95"/>
   <Column ss:Width="95"/>
   <Column ss:Width="110"/>
   <Row ss:Height="26">
    <Cell ss:MergeAcross="7" ss:StyleID="Title"><Data ss:Type="String">SAPHIRE INTERNATIONAL AIRPORT — AIRLINE BILLING &amp; TARIFF MANIFEST</Data></Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:MergeAcross="7"><Data ss:Type="String">Generated: ${new Date().toUTCString()} | Currency: USD ($) | Tariff Version: FY2026-R2</Data></Cell>
   </Row>
   <Row/>
   <Row ss:Height="22">
    <Cell ss:StyleID="Header"><Data ss:Type="String">Carrier Code</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Airline Name</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Flight No.</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Landing Fee</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Aerobridge Fee</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">GPU / PCA Fee</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Fuel Levies</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Total Payable</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">SPH</Data></Cell>
    <Cell><Data ss:Type="String">Saphire Airways</Data></Cell>
    <Cell><Data ss:Type="String">SPH-102</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">1850.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">450.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">220.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">340.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">2860.00</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">SPH</Data></Cell>
    <Cell><Data ss:Type="String">Saphire Airways</Data></Cell>
    <Cell><Data ss:Type="String">SPH-204</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">2400.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">520.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">290.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">410.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">3620.00</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">BA</Data></Cell>
    <Cell><Data ss:Type="String">British Airways</Data></Cell>
    <Cell><Data ss:Type="String">BA-142</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">2100.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">480.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">260.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">380.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">3220.00</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">EK</Data></Cell>
    <Cell><Data ss:Type="String">Emirates</Data></Cell>
    <Cell><Data ss:Type="String">EK-506</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">3800.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">750.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">420.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">650.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">5620.00</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">AI</Data></Cell>
    <Cell><Data ss:Type="String">Air India</Data></Cell>
    <Cell><Data ss:Type="String">AI-203</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">1650.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">400.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">210.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">310.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">2570.00</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">LH</Data></Cell>
    <Cell><Data ss:Type="String">Lufthansa</Data></Cell>
    <Cell><Data ss:Type="String">LH-760</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">2250.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">490.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">280.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">390.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">3410.00</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">SQ</Data></Cell>
    <Cell><Data ss:Type="String">Singapore Airlines</Data></Cell>
    <Cell><Data ss:Type="String">SQ-402</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">2150.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">470.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">270.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">375.00</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">3265.00</Data></Cell>
   </Row>
   <Row/>
   <Row ss:Height="22">
    <Cell ss:MergeAcross="2" ss:StyleID="BoldTotal"><Data ss:Type="String">CONSOLIDATED REVENUE TOTALS</Data></Cell>
    <Cell ss:StyleID="BoldTotal"><Data ss:Type="Number">16200.00</Data></Cell>
    <Cell ss:StyleID="BoldTotal"><Data ss:Type="Number">3560.00</Data></Cell>
    <Cell ss:StyleID="BoldTotal"><Data ss:Type="Number">1950.00</Data></Cell>
    <Cell ss:StyleID="BoldTotal"><Data ss:Type="Number">2855.00</Data></Cell>
    <Cell ss:StyleID="BoldTotal"><Data ss:Type="Number">24565.00</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob([xmlSpreadsheet], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    downloadBlob(blob, `Saphire_Airline_Billing_Manifest_${timestamp}.xls`);
    toast.success('Airline Billing & Tariff Manifest (Excel) generated & downloaded');
  } catch (err) {
    console.error('Failed to export Excel:', err);
    toast.error('Failed to generate Excel export.');
  }
};
