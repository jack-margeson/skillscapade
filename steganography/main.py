# This is a sample Python script.
import random
import pyaes

from PIL import Image


# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
def simple_image_steganograph(filename: str, output_filename: str, message: str):
    fp = open(filename, 'rb')
    data = fp.read()
    fp.close()

    fp = open(output_filename, 'wb')
    fp.write(data)
    fp.write(bytes(message, 'utf-8'))
    fp.close()


def simple_encrypted_image_steganograph(input_filename: str, output_filename: str, message: str, password: str):
    aes = pyaes.AESModeOfOperationCTR(bytes(password, 'utf-8'))
    encrypted_message = aes.encrypt(message)

    fp = open(input_filename, 'rb')
    data = fp.read()
    fp.close()

    fp = open(output_filename, 'wb')
    fp.write(data)
    fp.write(encrypted_message)
    fp.close()


def simple_decrypt_image_steganograph(filename: str, password: str):
    fp = open(filename, 'rb')
    fp.seek(2)
    size = fp.read(4)
    size = int(size[0]) + int(size[1] << 8) + int(size[2] << 16) + int(size[3] << 24)

    fp.seek(size)
    data = fp.read()

    aes = pyaes.AESModeOfOperationCTR(bytes(password, 'utf-8'))
    decrypted_data = aes.decrypt(data)
    print(decrypted_data)


def encode_lsb_image_steganograph(filename: str, message: str):
    image = Image.open(filename)
    pixels = image.load()

    assert (image.height * image.width > len(message) * 8)

    bitlist: list[int] = list()
    for char in message:
        for x in range(8):
            bitlist.append(ord(char) >> x & 1)

    while len(bitlist) % 3 != 0:
        bitlist.append(0)

    for y in range(image.height):
        if not len(bitlist):
            break
        for x in range(image.width):
            if not len(bitlist):
                break

            pixels[x, y] = tuple(map(lambda a, b: (a & 0b11111110) + b, pixels[x, y],
                                     (bitlist[0], bitlist[1], bitlist[2])
                                     ))

            bitlist = bitlist[3:]

    image.save("lsb_" + filename)


def decode_lsb_image_steganograph(filename: str):
    print("decoding")
    image = Image.open(filename)
    pixels = image.load()

    bitlist: list[int] = list()
    message: list = []

    for y in range(image.height):
        for x in range(image.width):
            bitlist += list(map(lambda a: a & 1, pixels[x, y]))

    while len(bitlist) > 8:
        char = (bitlist[7] << 7) + (bitlist[6] << 6) + (bitlist[5] << 5) + (bitlist[4] << 4) + (bitlist[3] << 3) + \
               (bitlist[2] << 2) + (bitlist[1] << 1) + (bitlist[0])
        message.append(chr(char))
        bitlist = bitlist[8:]

    print("".join(message))

"""
def encode_lsb_image_steganograph(filename: str, message: str, seed: str):
    print("encoding")
    image = Image.open(filename)
    pixels = image.load()

    random.seed(seed)

    bitlist: list[int] = list()
    used_pixels: set[tuple[int, int]] = set()

    for char in message:
        for x in range(8):
            bitlist.append(ord(char) >> x & 1)

    bitlist += [1, 1, 1, 1, 1, 1, 1, 1, 1]

    while len(bitlist) % 3 != 0:
        bitlist.append(0)

    print(bitlist)

    while len(bitlist):
        randx = random.randint(0, image.width - 1)
        randy = random.randint(0, image.height - 1)

        if (randx, randy) not in used_pixels:
            print("before: ", pixels[randx, randy])
            print(bitlist[:3])
            used_pixels.add((randx, randy))
            pixels[randx, randy] = tuple(map(lambda a, b: (a & 0b11111110) + b, pixels[randx, randy],
                                             (bitlist[0], bitlist[1], bitlist[2])
                                             ))
            print("after: ", pixels[randx, randy])
        bitlist = bitlist[3:]

    image.save("new_" + filename)
"""

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    simple_encrypted_image_steganograph("test.bmp", "encrypted.bmp", "Hello world!", "passwordpasswordpasswordpassword")
    simple_decrypt_image_steganograph("encrypted.bmp", "passwordpasswordpasswordpassword")
    simple_image_steganograph("test.bmp", "unencrypted.bmp", "Hello World!")
    encode_lsb_image_steganograph("test.bmp", "Hello!")
    decode_lsb_image_steganograph("lsb_test.bmp")

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
