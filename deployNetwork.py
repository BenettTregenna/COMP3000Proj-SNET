import sys
import paramiko

client = paramiko.SSHClient()

# should try and make this use ssh keys
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    client.connect('192.168.0.30', username='mininet', password='159856')
except:
    print("error, couldn't connect to Mininet server")

# try:

sftp = client.open_sftp()
sftp.put('networkConf.py', '/home/mininet/mininet/config/networkConf.py')
print('File uploaded')

# except:
# print("error,file copy to remote server failed")

# finally:
sftp.close()
client.close()

# stdout = client.exec_command('python ./networkConf.py')[1]
# for line in stdout:
#    print(line)


# print("pythonDN: network deployed")
# sys.exit(0)
