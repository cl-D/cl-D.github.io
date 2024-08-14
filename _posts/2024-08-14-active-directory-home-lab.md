---
title: Active Directory Home Lab
description: Set up Active Directory on a Windows Server 2022 VM and connect a Windows 10 VM to the domain
date: 2024-08-14
categories: [Active Directory, Home Lab]
tags: [active directory, home lab, project]
---


# Active Directory Home Lab

I realized that in my career as an IT Technician, I had experience serving as the administrator for an Active Directory Domain Controller, but never had the opportunity to set up Active Directory from scratch. In this lab we will set up and configure Active Directory on a virtual machine (VM) using VMware Workstation. We will also set up client VM's running Windows 11, that we will join to the Active Directory domain.

## Tools Used

- [VMware Workstation Pro](https://www.microsoft.com/en-us/software-download/windows10) (you can substitute this for your Hypervisor of choice)
- [Windows Server 2022](https://www.microsoft.com/en-us/windows-server)
- [Windows 10](https://www.microsoft.com/en-us/software-download/windows10)
- Active Directory Domain Services

## Important

- You can substitute the tools mentioned above for any other alternatives. While the menu's and steps taken might differ slightly, the fundamental concepts are the same.
- For this lab to work, you **NEED** to enable virtualization in your motherboard's BIOS. Without this, you cannot start the virtual machines. Please do your own research on how to enable this for your respective motherboard. 
## Setting up Windows Server on VMware Workstation

To begin, we will first configure our hypervisor for our Windows Server. Start by opening VMware Workstation Pro and clicking "Create a New Virtual Machine." We will go with the "Typical" configuration option.
![image](/assets/img/blog/Pasted_image_20240729152435.png)

Instead of selecting the Windows Server 2022 iso we previously downloaded, we will select "I will install the operating system later." and click next.
![image](/assets/img/blog/Pasted_image_20240729152554.png) 

Make sure to select "Microsoft Windows" and select "Windows Server 2022" from the drop down menu.
![image](/assets/img/blog/Pasted_image_20240729152619.png)

Name the VM whatever you'd like. In my case, I just named it "Windows Server 2022." You will also want to select where you want the VM to be installed. You can go with the default setting or pick a specific drive of your choice.
![image](/assets/img/blog/Pasted_image_20240729152705.png)

Leave the disk size on the recommended, and select the single file option.
![image](/assets/img/blog/Pasted_image_20240729152735.png)

Before we click "Finish" we will want to customize our hardware.
![image](/assets/img/blog/Pasted_image_20240729152756.png)

I opted for 8GB of memory and 4 cores for the processor. You will want to configure this based on your computer's specs. Note: setting these values too might will lead to performance drops on your host PC.
![image](/assets/img/blog/Pasted_image_20240729152901.png)

Go ahead and select the Windows Server 2022 ISO we downloaded earlier and then select close. Next, select "Finish" to complete the configuration.
![image](/assets/img/blog/Pasted_image_20240729152913.png)

Now, we're going to start our VM and press any key to boot up the Windows Installer.
![image](/assets/img/blog/Pasted_image_20240729152957.png)

Note: It's very important that you select the "Windows Server 2022 Standard Evaluation (Desktop Experience)" option. This will allow us to use the Windows Server like a normal windows computer, rather than through a command-line-interface (CLI).
![image](/assets/img/blog/Pasted_image_20240729153036.png)

Select the custom install option.
![image](/assets/img/blog/Pasted_image_20240729153124.png)

Your 60gb drive that you create previously will show up here. Click next.
![image](/assets/img/blog/Pasted_image_20240729153135.png)

It will now install the Windows Server. This will take a few minutes.
![image](/assets/img/blog/Pasted_image_20240729153227.png) 

Once the installation is complete, we will be greeted with a new window. Here we will set up our password for the default Administrator account. 
![image](/assets/img/blog/Pasted_image_20240729162126.png)

After you are done installing the Windows Server, it's now time to login for the first time. To unlock the pc you'll need to hit Ctrl+Alt+Delete. Conversely, you can have VMware send the command for you by going to VM > Send Ctrl+Alt+Del. This is handy if you're ever setting up a VM without a keyboard. 
![image](/assets/img/blog/Pasted_image_20240729162356.png)

## Installing VMware Tools

Once we have successfully logged into our Windows Server VM, we'll want to install VMware Tools to which is a set of services and components that will greatly improve our experience using the VM. One improvement that it will provide is allowing us to resize the VM simply by dragging the corners to our preferred size. 

To install VMware Tools go to VM > Install VMware Tools... 
![image](/assets/img/blog/Pasted_image_20240729162901.png)

VMware Tools will appear in our virtual DVD Drive (D:). Double click the drive and run the setup64.exe file.
![image](/assets/img/blog/Pasted_image_20240729163004.png)

This will open up an installation wizard. Click Next
![image](/assets/img/blog/Pasted_image_20240729163058.png)

Select "Typical" for setup type and finish the installation.
![image](/assets/img/blog/Pasted_image_20240729163110.png)

Once VMware Tools has finished installing, we'll need to restart the VM.
![image](/assets/img/blog/Pasted_image_20240729163234.png)
## Network Settings

In VMware Workstation go to *Edit* > *Virtual Network Editor* 

Make sure your Subnet IP is set to `10.0.2.0` and Subnet mask set to `255.255.255.0`

When you're done click *Apply*

![image](/assets/img/blog/Pasted_image_20240729165028.png)

Next, in VMware Workstation go to *VM* > *Settings*

Under Network Adapter, select the new virtual NAT network we just created and then hit ok. The subsequent client Windows 11 VM's that we will create will use the same virtual network.

![image](/assets/img/blog/Pasted_image_20240729165734.png)

## Setting up Windows 10 Client PC

It is now time to create our Windows 10 client PC that we will eventually connect to our domain. The process to set this up is fairly similar to setting up our Windows Server. 

Create a new virtual machine.
![image](/assets/img/blog/Pasted_image_20240730142505.png)

Select Windows 10 x64 or 11 x64 depending on what operating system you decided to go with.
![image](/assets/img/blog/Pasted_image_20240730142556.png)

Create an encryption password and store it somewhere safe. 
![image](/assets/img/blog/Pasted_image_20240730142739.png)

Choose your disk size. I went with the recommended.
![image](/assets/img/blog/Pasted_image_20240730142803.png)

Click "Customize Hardware"
![image](/assets/img/blog/Pasted_image_20240730142833.png)

Here we will select the ISO image file for Windows 10 or 11 and we can also configure our memory and number of processors.
![image](/assets/img/blog/Pasted_image_20240730143144.png)

Under the Network Adapter, select the custom virtual network we created earlier. Finish the configuration and start the VM.
![image](/assets/img/blog/Pasted_image_20240730143310.png)

Click Next to start the installation and setup process.
![image](/assets/img/blog/Pasted_image_20240730143331.png)

Select "I don't have a product key"
![image](/assets/img/blog/Pasted_image_20240730143404.png)

Select Windows 10/11 Pro. 
![image](/assets/img/blog/Pasted_image_20240730143456.png)

Select custom install and continue.
![image](/assets/img/blog/Pasted_image_20240730143532.png)

Windows is now installing. This will take some time.
![image](/assets/img/blog/Pasted_image_20240730143554.png)

Once we login to the PC we will go ahead and install the VMware tools just like we did for the Windows Server VM previously.

Next we will want to go into our Network Device Properties in order to set our Windows 10 VM's DNS server to point towards our Domain Controller.

![image](/assets/img/blog/Pasted_image_20240807163716.png)

Click "Internet Protocol Version 4 (TCP/IPv4)" and click "Properties"

![image](/assets/img/blog/Pasted_image_20240807163844.png)

![image](/assets/img/blog/Pasted_image_20240807164309.png)
Now, select "Use the following DNS server addresses" and head on back over to the Windows Server 2022 VM.

In our Windows Server 2022 VM we will type "cmd" into the search bar and open up "Command Prompt." Next type "ipconfig" and hit enter. This will show us our IPv4 address.

![image](/assets/img/blog/Pasted_image_20240807164235.png)

Type the IPv4 address into the "Preferred DNS server" input and add "8.8.8.8" to the "Alternate DNS server." Then hit "Ok."

![image](/assets/img/blog/Pasted_image_20240807164603.png)

### Setting up Active Directory Domain Services

It's finally time to set up Active Directory Domain Services on our Windows Server 2022 VM.

We will do this through the "Server Manager." If you don't have this already open, you can find it using the search bar at the bottom.

![image](/assets/img/blog/Pasted_image_20240807164919.png)

In the Server Manager we will start by click "Add roles and features."

![image](/assets/img/blog/Pasted_image_20240807164957.png)

Click Next until you get to "Server Roles." Here we will want to make sure we have "Active Directory Domain Services" selected.

Once selected, click "Add Features."

![image](/assets/img/blog/Pasted_image_20240807165221.png)

Then click, "Next" 

![image](/assets/img/blog/Pasted_image_20240807165237.png)

Keep clicking Next until you get to the Confirmation page and then hit "Install"

![image](/assets/img/blog/Pasted_image_20240807165431.png)

This will take some time.

![image](/assets/img/blog/Pasted_image_20240807165505.png)


Once it has successfully installed, you can close out of the window.

Next, click on the flag at the top and click "Promote this server to a domain controller"

![image](/assets/img/blog/Pasted_image_20240807165651.png)

Click "Add a new forest" and enter any domain name you'd like. I recommend add a `.com` or `.local` to the end of it. Other Top-level domains (TLD) should work too, but I haven't tested those.

![image](/assets/img/blog/Pasted_image_20240807170114.png)

Click, next and create a recovery password.

![image](/assets/img/blog/Pasted_image_20240807170255.png)

Continue through the menus. A NetBIOS domain name will automatically be generated for you.

![image](/assets/img/blog/Pasted_image_20240807170357.png)

Click "Next" all the way through and then click "Install"

![image](/assets/img/blog/Pasted_image_20240807170453.png)

After installation, reboot the VM.

Upon reboot, you'll be greeted with a new login screen that contains your domain name.

![image](/assets/img/blog/Pasted_image_20240807172405.png)

## Creating Users

Now it's time to create our first user in Active Directory.

Open up Server Manager if it's not already open and click "Tools" > "Active Directory Users and Computers"

![image](/assets/img/blog/Pasted_image_20240807172832.png)

This will open up a new windows where we can manage users and computers.
First, we will want to create a new Organizational Unit called "\_USERS" and then create a new user within this OU.

To do this right click "mydomain.local" > "New" > "Organizational Unit"

![image](/assets/img/blog/Pasted_image_20240807173127.png)

Name it "\_USERS"

![image](/assets/img/blog/Pasted_image_20240807173237.png)

This will create a new folder under "mydomain.local" called "\_USERS"
Right click this folder and create a new user.
Fill out the information however you'd like.
![image](/assets/img/blog/Pasted_image_20240807173453.png)

Click Next and create a new password. Make sure you have "User must change password at next logon" unchecked and "Password never expires" checked.

![image](/assets/img/blog/Pasted_image_20240807173641.png)

Now that the account is created, we will use it to join our Windows 10 VM to our domain so that our domain has full control over the user and computer.

## Joining Host to the Domain

Before joining the Windows 10 VM to the domain, the first thing that I like to do is to rename the PC to something more easily identifiable. To do this right click the start button and click "System."

![image](/assets/img/blog/Pasted_image_20240807174306.png)

![image](/assets/img/blog/Pasted_image_20240807174337.png)

I renamed the PC to "USER-PC1," but you can pick a name of your choosing.

![image](/assets/img/blog/Pasted_image_20240807174450.png)

Renaming the PC will require a system restart.

Once you've rebooted, go to the search bar and type "Access work or school" and click on the first option.

![image](/assets/img/blog/Pasted_image_20240807175121.png)

Click Connect

![image](/assets/img/blog/Pasted_image_20240807175151.png)

A new windows will pop up, click "Join this device to a local Active Directory domain" at the bottom.

![image](/assets/img/blog/Pasted_image_20240807175239.png)

Type the domain name you created earlier and click next.

![image](/assets/img/blog/Pasted_image_20240807175311.png)

This is where you'll type the information of the user account we created earlier.

![image](/assets/img/blog/Pasted_image_20240807175806.png)

This will be a standard account.

![image](/assets/img/blog/Pasted_image_20240807175828.png)

You will be prompted to restart the PC. 

Upon restart, the computer will have successfully joined the domain and you can login with the new user that you had created.

![image](/assets/img/blog/Pasted_image_20240807180000.png)

If we check Active Directory, we can see that our PC "USER-PC1" now appears under "Computers."

![image](/assets/img/blog/Pasted_image_20240807180316.png)

Congratulations! We have successfully set up Active Directory, created our first user, and joined our user's PC to the domain!



