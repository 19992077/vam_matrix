from cx_Freeze import setup, Executable

includefiles = ["templates","static"]
main_executable = Executable("porn_matrix.py", icon="grid.ico")

setup(name="Porn_Matrix",
    version="0.1",
    description="A flask server application for porn multiplexing",
    include_package_data=True,
    install_requires=[
    "Flask",
    "waitress",
    ],
    options={
        "build_exe": {
            "packages": ["jinja2.ext", "asyncio", "idna.idnadata"],
            "include_files": includefiles,
            "include_msvcr": True,
            "excludes": ["tkinter"]}},
    executables=[main_executable])