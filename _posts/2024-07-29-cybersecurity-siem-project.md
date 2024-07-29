---
title: Cybersecurity SIEM Honeypot Project
description: Setup up your own cyber honeypot and monitor attacks in Microsoft Sentinel (SIEM) 
date: 2024-07-29
categories: [Security, SIEM]
tags: [security, siem, project, honeypot]
---

## Introduction

The idea behind this project is to create a VM in Microsoft Azure that serves as a honeypot for attackers. This VM is running Windows 10 Pro with all of its ports open and Windows Defender Firewall turned off. As threat actors try to brute force their way into the VM through RDP atacks, the Windows Event Viewer logs for failed login attempts are parsed for the attacker's geographic information. Using the [ipgeolocation.io](https://app.ipgeolocation.io/) API, the attacker's IP is mapped to a general location on the map (city, country) and this data is then uploaded to a table in Microsoft's Log analytics workspace. Lastly, the data is queried in a workbook in Microsoft Sentinel and graphed on a map.

### Tools and Resources

- **Microsoft Sentinel:** Graph and analyse security events
- **Microsoft Defender for Cloud:** For gathering logs from the VM
- **Microsoft Log Analytics Workspace:** Store and organize logs  
- **Microsoft Azure VM:** Serves as the honeypot
- **PowerShell:** A script for converting IP's, from failed RDP attacks, into useful geolocation
- **KQL:** Query language used to structure data from logs
- **ipgeolocation.io:** Provides the API for mapping IP to geolocation

### Attacks Graphed on a World Map

![Failed RDP Attacks Graphed](/assets/img/blog/failed_rdp_geo_graph.png)

### Most Common Account Names Used During RDP Attacks

![Failed RDP Attacks Bar Graphed](/assets/img/blog/failed_rdp_bar_graph.png)
