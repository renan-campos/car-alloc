# Define variables
BINDIR := bin
SRCDIR := cmd
PKGDIR := pkg

# Find all Go source files in the cmd directory
SOURCES := $(wildcard $(SRCDIR)/*)

# Find all packages
PACKAGES := $(wildcard $(PKGDIR)/*)

# Define the executables to be created
EXECUTABLES := $(patsubst $(SRCDIR)/%, $(BINDIR)/%, $(SOURCES))

# Default target
all: $(EXECUTABLES)

# Rule to build each executable
$(BINDIR)/%: $(SRCDIR)/% $(PACKAGES)
	@mkdir -p $(BINDIR)
	go build -o $@ ./$<

# Clean up binaries
clean:
	rm -rf $(BINDIR)

# PHONY targets
.PHONY: all clean

